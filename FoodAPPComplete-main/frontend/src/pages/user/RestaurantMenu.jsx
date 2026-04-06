import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRestaurantById, getRestaurantMenu, placeOrder } from '../../api/api'
import toast from 'react-hot-toast'
import { MdArrowBack, MdShoppingCart, MdRestaurant, MdLocationOn, MdAccessTime } from 'react-icons/md'

function RestaurantMenu() {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [orderItem, setOrderItem] = useState(null)
  const [orderForm, setOrderForm] = useState({ quantity: 1, modeOfPayment: 'CASH' })
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const [restRes, menuRes] = await Promise.all([
        getRestaurantById(id),
        getRestaurantMenu(id)
      ])
      setRestaurant(restRes.data)
      setMenuItems(menuRes.data || [])
    } catch (err) {
      toast.error('Failed to load restaurant details')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async (item) => {
    setPlacing(true)
    try {
      const payload = {
        itemName: item.itemName,
        quantity: orderForm.quantity,
        restName: restaurant.restName,
        modeOfPayment: orderForm.modeOfPayment,
      }
      const res = await placeOrder(payload)
      toast.success(`Order placed! Order ID: ${res.data.orderId}`)
      setOrderItem(null)
      setOrderForm({ quantity: 1, modeOfPayment: 'CASH' })
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/restaurants" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6">
        <MdArrowBack /> Back to Restaurants
      </Link>

      {/* Restaurant Header */}
      {restaurant && (
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-8 text-white mb-8">
          <h1 className="text-3xl font-bold mb-3">{restaurant.restName}</h1>
          <div className="flex flex-wrap gap-4 text-primary-100">
            <div className="flex items-center gap-1">
              <MdLocationOn />
              <span>{restaurant.location || 'Location not available'}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdAccessTime />
              <span>{restaurant.startTime} - {restaurant.endTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Menu</h2>

      {menuItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <MdRestaurant className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl text-gray-500">No menu items available</h3>
          <p className="text-gray-400 mt-2">This restaurant hasn't added any menu items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => (
            <div key={item.itemId} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.itemName}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.active !== false ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <div className="text-xl font-bold text-primary-600">
                  Rs. {item.costPerItem}
                </div>
              </div>

              {orderItem?.itemId === item.itemId ? (
                <div className="border-t pt-4 mt-3 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500">Payment</label>
                      <select
                        value={orderForm.modeOfPayment}
                        onChange={(e) => setOrderForm({ ...orderForm, modeOfPayment: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="UPI">UPI</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    Total: Rs. {item.costPerItem * orderForm.quantity}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlaceOrder(item)}
                      disabled={placing}
                      className="flex-1 bg-primary-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition disabled:opacity-50"
                    >
                      {placing ? 'Placing...' : 'Confirm Order'}
                    </button>
                    <button
                      onClick={() => setOrderItem(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setOrderItem(item)
                    setOrderForm({ quantity: 1, modeOfPayment: 'CASH' })
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-primary-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-600 transition"
                >
                  <MdShoppingCart /> Order Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RestaurantMenu
