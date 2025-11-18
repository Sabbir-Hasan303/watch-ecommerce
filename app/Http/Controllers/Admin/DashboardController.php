<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard with statistics and charts.
     */
    public function index()
    {
        $period = $this->normalizePeriod(request()->get('period', '6months'));
        $monthsBack = $period === 'year' ? 12 : 6;

        $basicStats = $this->getBasicStats();
        $stats = $this->getStats($basicStats);

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $this->getRecentOrders(),
            'productSales' => $this->getProductSales(),
            'salesDistribution' => $this->getSalesDistribution($basicStats['totalRevenue']),
            'revenueTrends' => $this->getRevenueTrends($monthsBack),
            'orderTrends' => $this->getOrderTrends($monthsBack),
            'selectedPeriod' => $period,
            'totalRevenue' => (float) $basicStats['totalRevenue'],
        ]);
    }

    /**
     * Get basic statistics (totals without percentage changes).
     */
    protected function getBasicStats(): array
    {
        return [
            'totalRevenue' => Order::where('status', 'delivered')->sum('total'),
            'totalOrders' => Order::count(),
            'totalCustomers' => User::where('role', '!=', 'admin')->count(),
            'activeProducts' => Product::where('status', 'active')->count(),
        ];
    }

    /**
     * Get statistics formatted for display.
     */
    protected function getStats(array $basicStats): array
    {
        return [
            [
                'title' => 'Total Revenue',
                'value' => '$' . number_format($basicStats['totalRevenue'], 2),
                'icon' => 'DollarSign',
                'color' => 'from-emerald-500 to-teal-500',
            ],
            [
                'title' => 'Total Orders',
                'value' => number_format($basicStats['totalOrders']),
                'icon' => 'ShoppingCart',
                'color' => 'from-blue-500 to-cyan-500',
            ],
            [
                'title' => 'Total Customers',
                'value' => number_format($basicStats['totalCustomers']),
                'icon' => 'Users',
                'color' => 'from-purple-500 to-pink-500',
            ],
            [
                'title' => 'Active Products',
                'value' => number_format($basicStats['activeProducts']),
                'icon' => 'Package',
                'color' => 'from-orange-500 to-red-500',
            ],
        ];
    }

    /**
     * Get recent orders for the dashboard.
     */
    protected function getRecentOrders(): Collection
    {
        return Order::with('user')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($order) {
                $customerName = $order->user->name ?? ($order->shipping_address['full_name'] ?? 'Unknown');
                return [
                    'id' => $order->order_number,
                    'customer' => $customerName,
                    'amount' => (float) $order->total,
                    'status' => $this->mapOrderStatus($order->status),
                    'time' => $order->created_at->diffForHumans(),
                ];
            });
    }

    /**
     * Get top selling products for the bar chart.
     */
    protected function getProductSales(): Collection
    {
        return OrderItem::select('products.name')
            ->selectRaw('SUM(order_items.quantity) as total_quantity')
            ->selectRaw('SUM(order_items.total_price) as total_revenue')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'sales' => $item->total_quantity,
                    'revenue' => number_format($item->total_revenue, 2),
                ];
            });
    }

    /**
     * Get sales distribution by category for the donut chart.
     */
    protected function getSalesDistribution(float $totalRevenue): Collection
    {
        $categorySales = OrderItem::select('categories.name')
            ->selectRaw('SUM(order_items.total_price) as total_revenue')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('category_product', 'products.id', '=', 'category_product.product_id')
            ->join('categories', 'category_product.category_id', '=', 'categories.id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'delivered')
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc('total_revenue')
            ->get();

        $colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500'];

        return $categorySales->map(function ($item, $index) use ($totalRevenue, $colors) {
            $percentage = $totalRevenue > 0 ? ($item->total_revenue / $totalRevenue) * 100 : 0;

            return [
                'label' => $item->name,
                'value' => number_format($percentage, 1) . '%',
                'color' => $colors[$index % count($colors)] ?? 'bg-gray-500',
            ];
        });
    }

    /**
     * Get revenue trends for the selected period.
     */
    protected function getRevenueTrends(int $monthsBack): Collection
    {
        $orderData = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
            ->selectRaw('SUM(total) as revenue')
            ->where('status', 'delivered')
            ->where('created_at', '>=', now()->subMonths($monthsBack))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        return $this->generateMonthlyData($monthsBack, $orderData, 'revenue');
    }

    /**
     * Get order trends for the selected period.
     */
    protected function getOrderTrends(int $monthsBack): Collection
    {
        $orderCountData = Order::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month')
            ->selectRaw('COUNT(*) as order_count')
            ->where('created_at', '>=', now()->subMonths($monthsBack))
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        return $this->generateMonthlyData($monthsBack, $orderCountData, 'orders', 'order_count');
    }

    /**
     * Generate monthly data for charts, filling in missing months with zero values.
     */
    protected function generateMonthlyData(
        int $monthsBack,
        Collection $data,
        string $valueKey,
        ?string $dataKey = null
    ): Collection {
        $dataKey = $dataKey ?? $valueKey;

        return collect(range($monthsBack - 1, 0))
            ->map(function ($i) use ($data, $valueKey, $dataKey) {
                $date = now()->subMonths($i);
                $monthKey = $date->format('Y-m');
                $monthLabel = $date->format('M Y');

                $value = isset($data[$monthKey])
                    ? (is_numeric($data[$monthKey]->$dataKey) ? (float) $data[$monthKey]->$dataKey : 0)
                    : 0;

                return [
                    'month' => $monthLabel,
                    $valueKey => $value,
                ];
            });
    }

    /**
     * Map database order status to frontend display format.
     */
    protected function mapOrderStatus(string $status): string
    {
        return match ($status) {
            'delivered' => 'Completed',
            'confirmed', 'shipped' => 'Processing',
            'pending' => 'Pending',
            'cancelled' => 'Cancelled',
            default => ucfirst($status),
        };
    }

    /**
     * Normalize period value to valid options.
     */
    protected function normalizePeriod(string $period): string
    {
        return $period === 'year' ? 'year' : '6months';
    }
}
