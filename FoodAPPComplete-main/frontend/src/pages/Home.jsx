import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MdDeliveryDining, MdRestaurant, MdTimer, MdLocationOn } from 'react-icons/md'

function Home() {
  const { isAuthenticated, userType } = useAuth()

  const getDashboardLink = () => {
    switch (userType) {
      case 'user': return '/restaurants'
      case 'merchant': return '/merchant'
      case 'driver': return '/driver'
      default: return '/login'
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Delicious Food,<br />Delivered To Your Door
            </h1>
            <p className="text-lg md:text-xl mb-8 text-primary-100">
              Order from your favorite restaurants and get fresh meals delivered fast.
              Browse menus, place orders, and track your delivery in real time.
            </p>
            <div className="flex flex-wrap gap-4">
              {isAuthenticated ? (
                <Link to={getDashboardLink()} className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition shadow-lg">
                    Get Started
                  </Link>
                  <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdRestaurant className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Restaurants</h3>
              <p className="text-gray-600">Explore a variety of restaurants and their menus near you.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLocationOn className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Your Order</h3>
              <p className="text-gray-600">Select your favorite items, choose payment method, and order.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdTimer className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">The nearest driver picks up and delivers your food fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Join Our Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-primary-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">As a Customer</h3>
              <p className="text-gray-600 mb-4">Order food from restaurants, track delivery, and enjoy your meal.</p>
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">Sign up as Customer &rarr;</Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-green-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">As a Merchant</h3>
              <p className="text-gray-600 mb-4">Register your restaurant, manage your menu, and receive orders.</p>
              <Link to="/register" className="text-green-600 font-semibold hover:underline">Sign up as Merchant &rarr;</Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-blue-500">
              <h3 className="text-xl font-bold mb-3 text-gray-800">As a Driver</h3>
              <p className="text-gray-600 mb-4">Set your availability, pick up orders, and earn money.</p>
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">Sign up as Driver &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
