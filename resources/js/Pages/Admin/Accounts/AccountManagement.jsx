import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  PieChart,
} from "lucide-react"
import { Card, Button } from "@mui/material"
// import { Card } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

export function AccountsManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [searchQuery, setSearchQuery] = useState("")

  const accountStats = [
    {
      title: "Total Revenue",
      value: "$124,563.89",
      change: "+23.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-emerald-500 to-teal-500",
      description: "vs last month",
      subtext: "Net income after expenses",
    },
    {
      title: "Total Expenses",
      value: "$45,231.50",
      change: "+8.2%",
      trend: "up",
      icon: CreditCard,
      color: "from-red-500 to-orange-500",
      description: "vs last month",
      subtext: "Operating costs",
    },
    {
      title: "Net Profit",
      value: "$79,332.39",
      change: "+31.4%",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
      description: "vs last month",
      subtext: "After tax profit",
    },
    {
      title: "Account Balance",
      value: "$256,789.12",
      change: "+12.8%",
      trend: "up",
      icon: Wallet,
      color: "from-purple-500 to-pink-500",
      description: "vs last month",
      subtext: "Available funds",
    },
  ]

  const revenueData = [
    { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
    { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
    { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
    { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
    { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
    { month: "Jun", revenue: 67000, expenses: 41000, profit: 26000 },
  ]

  const transactions = [
    {
      id: "TXN-001",
      type: "income",
      description: "Product Sales - Electronics",
      amount: 12450.0,
      date: "2024-02-10",
      status: "completed",
      category: "Sales",
    },
    {
      id: "TXN-002",
      type: "expense",
      description: "Inventory Purchase",
      amount: 8500.0,
      date: "2024-02-09",
      status: "completed",
      category: "Inventory",
    },
    {
      id: "TXN-003",
      type: "income",
      description: "Product Sales - Clothing",
      amount: 6780.5,
      date: "2024-02-09",
      status: "completed",
      category: "Sales",
    },
    {
      id: "TXN-004",
      type: "expense",
      description: "Marketing Campaign",
      amount: 3200.0,
      date: "2024-02-08",
      status: "pending",
      category: "Marketing",
    },
    {
      id: "TXN-005",
      type: "income",
      description: "Subscription Revenue",
      amount: 4500.0,
      date: "2024-02-08",
      status: "completed",
      category: "Subscription",
    },
    {
      id: "TXN-006",
      type: "expense",
      description: "Office Supplies",
      amount: 850.75,
      date: "2024-02-07",
      status: "completed",
      category: "Operations",
    },
    {
      id: "TXN-007",
      type: "income",
      description: "Product Sales - Accessories",
      amount: 3450.25,
      date: "2024-02-07",
      status: "completed",
      category: "Sales",
    },
    {
      id: "TXN-008",
      type: "expense",
      description: "Shipping & Logistics",
      amount: 2100.0,
      date: "2024-02-06",
      status: "completed",
      category: "Logistics",
    },
  ]

  const salesSummary = [
    { category: "Electronics", revenue: 45231, percentage: 36, trend: "+12%" },
    { category: "Clothing", revenue: 32450, percentage: 26, trend: "+8%" },
    { category: "Accessories", revenue: 28900, percentage: 23, trend: "+15%" },
    { category: "Home & Garden", revenue: 18982, percentage: 15, trend: "+5%" },
  ]

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue))

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Accounts Dashboard
          </h2>
          <p className="text-gray-500 mt-1">Monitor your financial performance and revenue</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20">
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {accountStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-[#1C252E] border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 cursor-pointer overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div
                    className={cn(
                      "absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 bg-gradient-to-br",
                      stat.color,
                    )}
                  />
                  <div
                    className={cn(
                      "relative w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg",
                      stat.color,
                    )}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn("text-sm font-medium", stat.trend === "up" ? "text-emerald-500" : "text-red-500")}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-2 group-hover:text-gray-400 transition-colors">{stat.title}</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                {stat.value}
              </h3>
              <p className="text-xs text-gray-600">{stat.subtext}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="bg-[#1C252E] border-white/5 p-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <p className="text-sm text-gray-500 mt-1">Monthly revenue, expenses, and profit trends</p>
          </div>
          <div className="flex items-center gap-2">
            {["week", "month", "quarter", "year"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  selectedPeriod === period
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5",
                )}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Bar Chart */}
        <div className="space-y-6">
          {revenueData.map((data, index) => (
            <div key={index} className="space-y-2 group">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-medium w-12">{data.month}</span>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-emerald-400">Revenue: ${(data.revenue / 1000).toFixed(1)}k</span>
                  <span className="text-red-400">Expenses: ${(data.expenses / 1000).toFixed(1)}k</span>
                  <span className="text-blue-400">Profit: ${(data.profit / 1000).toFixed(1)}k</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                    style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg transition-all duration-500"
                    style={{ width: `${(data.expenses / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            <span className="text-sm text-gray-400">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
            <span className="text-sm text-gray-400">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <span className="text-sm text-gray-400">Profit</span>
          </div>
        </div>
      </Card>

      {/* Sales Summary & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Summary */}
        <Card className="bg-[#1C252E] border-white/5 p-6 animate-in fade-in slide-in-from-left-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Sales Summary</h3>
              <p className="text-sm text-gray-500 mt-1">Revenue by category</p>
            </div>
            <PieChart className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="space-y-4">
            {salesSummary.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-medium">{item.trend}</span>
                    <span className="text-sm font-semibold text-white">${(item.revenue / 1000).toFixed(1)}k</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 min-w-[40px] text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Total Revenue</span>
              <span className="text-lg font-bold text-white">
                ${salesSummary.reduce((acc, item) => acc + item.revenue, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-[#1C252E] border-white/5 p-6 lg:col-span-2 animate-in fade-in slide-in-from-right-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
              <p className="text-sm text-gray-500 mt-1">Latest financial activities</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
              <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-gradient-to-r hover:from-emerald-500/10 hover:to-teal-500/10 transition-all duration-300 group cursor-pointer border border-transparent hover:border-emerald-500/20"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div
                      className={cn(
                        "absolute inset-0 blur-md opacity-50 group-hover:opacity-75 transition-opacity rounded-lg",
                        transaction.type === "income"
                          ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                          : "bg-gradient-to-br from-red-400 to-orange-500",
                      )}
                    />
                    <div
                      className={cn(
                        "relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg",
                        transaction.type === "income"
                          ? "bg-gradient-to-br from-emerald-400 to-teal-500"
                          : "bg-gradient-to-br from-red-400 to-orange-500",
                      )}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="w-5 h-5 text-white" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{transaction.id}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{transaction.date}</span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">{transaction.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        transaction.type === "income" ? "text-emerald-400" : "text-red-400",
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </p>
                    <span
                      className={cn(
                        "inline-block px-2 py-1 text-xs font-medium rounded-full",
                        transaction.status === "completed" && "text-emerald-400 bg-emerald-500/10",
                        transaction.status === "pending" && "text-orange-400 bg-orange-500/10",
                      )}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
