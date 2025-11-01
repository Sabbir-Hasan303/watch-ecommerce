import { Minus, Plus, X } from "lucide-react"
import { useCart } from "@/contexts/CartContext"

export default function CartItem({ id, name, price, color, quantity, image }) {
  const { updateQuantity, removeItem } = useCart()

  const handleDecrease = async () => {
    if (quantity <= 1) {
      return
    }

    try {
      await updateQuantity(id, quantity - 1)
    } catch (error) {
      // handled by context
    }
  }

  const handleIncrease = async () => {
    try {
      await updateQuantity(id, quantity + 1)
    } catch (error) {
      // handled by context
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(id)
    } catch (error) {
      // handled by context
    }
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Product Image */}
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {/* <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        /> */}
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight">{name}</h3>
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Color: {color}</p>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrease}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <div className="font-bold text-sm">{price}</div>
        </div>
      </div>
    </div>
  )
}
