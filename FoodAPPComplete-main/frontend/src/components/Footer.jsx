import { MdDeliveryDining } from 'react-icons/md'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
              <MdDeliveryDining className="text-primary-500 text-2xl" />
              Foodies
            </div>
            <p className="text-sm">Your favorite food, delivered fast to your doorstep.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/" className="hover:text-primary-400">Home</a></li>
              <li><a href="/restaurants" className="hover:text-primary-400">Restaurants</a></li>
              <li><a href="/register" className="hover:text-primary-400">Sign Up</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3">Join Us</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="/register" className="hover:text-primary-400">Become a Merchant</a></li>
              <li><a href="/register" className="hover:text-primary-400">Become a Driver</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
          Foodies Food Delivery &copy; {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}

export default Footer
