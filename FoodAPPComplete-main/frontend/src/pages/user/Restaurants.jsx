import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRestaurants } from '../../api/api'
import toast from 'react-hot-toast'
import { MdRestaurant, MdAccessTime, MdLocationOn } from 'react-icons/md'

function Restaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const res = await getRestaurants()
      setRestaurants(res.data || [])
    } catch (err) {
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const filtered = restaurants.filter(r =>
    r.restName?.toLowerCase().includes(search.toLowerCase()) ||
    r.location?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurants</h1>
        <p className="text-gray-500">Browse and order from available restaurants</p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants by name or location..."
          className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MdRestaurant className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl text-gray-500">No restaurants found</h3>
          <p className="text-gray-400 mt-2">
            {restaurants.length === 0 ? 'No restaurants are registered yet.' : 'Try a different search term.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <Link
              key={restaurant.pk}
              to={`/restaurants/${restaurant.pk}/menu`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-primary-400 to-primary-600 h-36 flex items-center justify-center">
                <MdRestaurant className="text-white text-6xl opacity-50 group-hover:opacity-70 transition" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{restaurant.restName}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <MdLocationOn className="text-primary-500" />
                  <span>{restaurant.location || 'Location not available'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MdAccessTime className="text-primary-500" />
                  <span>
                    {restaurant.startTime ? `${restaurant.startTime} - ${restaurant.endTime}` : 'Hours not set'}
                  </span>
                </div>
                <div className="mt-3">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    restaurant.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {restaurant.active !== false ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Restaurants
