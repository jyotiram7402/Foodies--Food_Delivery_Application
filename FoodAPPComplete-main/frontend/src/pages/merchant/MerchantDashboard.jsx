import { useState, useEffect } from 'react'
import { onboardRestaurant, addMenuItem, getMyRestaurant, getMyMenuItems } from '../../api/api'
import toast from 'react-hot-toast'
import { MdRestaurant, MdMenuBook, MdAdd, MdStorefront } from 'react-icons/md'

function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [restaurant, setRestaurant] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [restForm, setRestForm] = useState({
    restaurantName: '',
    address: '',
    openAt: '09:00:00',
    closeAt: '22:00:00',
  })
  const [menuForm, setMenuForm] = useState({ itemName: '', costPerItem: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const restRes = await getMyRestaurant()
      setRestaurant(restRes.data)
      try {
        const menuRes = await getMyMenuItems()
        setMenuItems(menuRes.data || [])
      } catch (e) {
        setMenuItems([])
      }
    } catch (err) {
      setRestaurant(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRestSubmit = async (e) => {
    e.preventDefault()
    if (!restForm.restaurantName || !restForm.address) {
      toast.error('Please fill restaurant name and address')
      return
    }
    setSubmitting(true)
    try {
      const res = await onboardRestaurant(restForm)
      toast.success(`Restaurant registered! ID: ${res.data.restaurantId}`)
      setRestForm({ restaurantName: '', address: '', openAt: '09:00:00', closeAt: '22:00:00' })
      loadData()
      setActiveTab('overview')
    } catch (err) {
      toast.error('Failed to register restaurant')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMenuSubmit = async (e) => {
    e.preventDefault()
    if (!menuForm.itemName || !menuForm.costPerItem) {
      toast.error('Please fill all fields')
      return
    }
    setSubmitting(true)
    try {
      const res = await addMenuItem({
        itemName: menuForm.itemName,
        costPerItem: parseInt(menuForm.costPerItem),
      })
      toast.success(`Menu item added! ID: ${res.data.menuId}`)
      setMenuForm({ itemName: '', costPerItem: '' })
      loadData()
    } catch (err) {
      toast.error('Failed to add menu item. Make sure you have a registered restaurant.')
    } finally {
      setSubmitting(false)
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Merchant Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your restaurant and menu</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b">
        {[
          { key: 'overview', label: 'Overview', icon: MdStorefront },
          { key: 'restaurant', label: 'Add Restaurant', icon: MdRestaurant },
          { key: 'menu', label: 'Add Menu Item', icon: MdMenuBook },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition border-b-2 -mb-px ${
              activeTab === key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {restaurant ? (
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Restaurant</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold">{restaurant.restName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold">{restaurant.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hours</p>
                    <p className="font-semibold">{restaurant.startTime} - {restaurant.endTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      restaurant.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {restaurant.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Menu Items ({menuItems.length})</h2>
                {menuItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MdMenuBook className="text-4xl mx-auto mb-2" />
                    <p>No menu items yet. Add your first item!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {menuItems.map((item) => (
                      <div key={item.itemId} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="font-semibold text-gray-800">{item.itemName}</p>
                          <span className={`text-xs ${item.active !== false ? 'text-green-600' : 'text-red-600'}`}>
                            {item.active !== false ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-primary-600">Rs. {item.costPerItem}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <MdStorefront className="text-gray-300 text-6xl mx-auto mb-4" />
              <h3 className="text-xl text-gray-500">No restaurant registered</h3>
              <p className="text-gray-400 mt-2 mb-4">Register your restaurant to start receiving orders.</p>
              <button
                onClick={() => setActiveTab('restaurant')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition"
              >
                Register Restaurant
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Restaurant Tab */}
      {activeTab === 'restaurant' && (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Register Restaurant</h2>
          <form onSubmit={handleRestSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={restForm.restaurantName}
                onChange={(e) => setRestForm({ ...restForm, restaurantName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="My Restaurant"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={restForm.address}
                onChange={(e) => setRestForm({ ...restForm, address: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="123 Food Street, City"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opens At</label>
                <input
                  type="text"
                  value={restForm.openAt}
                  onChange={(e) => setRestForm({ ...restForm, openAt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="09:00:00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closes At</label>
                <input
                  type="text"
                  value={restForm.closeAt}
                  onChange={(e) => setRestForm({ ...restForm, closeAt: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="22:00:00"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">Time format: HH:MM:SS (e.g., 09:00:00)</p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Register Restaurant'}
            </button>
          </form>
        </div>
      )}

      {/* Add Menu Tab */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Add Menu Item</h2>
          {!restaurant ? (
            <div className="text-center py-8 text-gray-400">
              <p>Please register a restaurant first before adding menu items.</p>
            </div>
          ) : (
            <form onSubmit={handleMenuSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={menuForm.itemName}
                  onChange={(e) => setMenuForm({ ...menuForm, itemName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="Butter Chicken"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Item (Rs.)</label>
                <input
                  type="number"
                  min="1"
                  value={menuForm.costPerItem}
                  onChange={(e) => setMenuForm({ ...menuForm, costPerItem: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="350"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Menu Item'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default MerchantDashboard
