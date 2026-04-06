import { useState, useEffect } from 'react'
import { getMyOrders } from '../../api/api'
import toast from 'react-hot-toast'
import { MdReceipt, MdRestaurant, MdPayment } from 'react-icons/md'

function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders()
      setOrders(res.data || [])
    } catch (err) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-500">Track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <MdReceipt className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl text-gray-500">No orders yet</h3>
          <p className="text-gray-400 mt-2">Browse restaurants and place your first order!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.pk} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Order #{order.pk}
                    </span>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{order.itemName}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MdRestaurant className="text-primary-500" />
                      {order.restName}
                    </div>
                    <div className="flex items-center gap-1">
                      <MdPayment className="text-primary-500" />
                      {order.modeOfPayment}
                    </div>
                    <div>Qty: {order.quantity}</div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {order.orderCreatedAt ? new Date(order.orderCreatedAt).toLocaleString() : 'Recently'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders
