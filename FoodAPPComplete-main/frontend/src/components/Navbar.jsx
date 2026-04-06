import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX } from 'react-icons/fi'
import { MdDeliveryDining } from 'react-icons/md'

function Navbar() {
  const { user, isAuthenticated, userType, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const navLinks = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link to="/login" className="hover:text-primary-500 transition" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition" onClick={() => setMenuOpen(false)}>Sign Up</Link>
        </>
      )
    }

    switch (userType) {
      case 'user':
        return (
          <>
            <Link to="/restaurants" className="hover:text-primary-500 transition" onClick={() => setMenuOpen(false)}>Restaurants</Link>
            <Link to="/orders" className="hover:text-primary-500 transition" onClick={() => setMenuOpen(false)}>My Orders</Link>
            <span className="text-gray-500 text-sm">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
          </>
        )
      case 'merchant':
        return (
          <>
            <Link to="/merchant" className="hover:text-primary-500 transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <span className="text-gray-500 text-sm">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
          </>
        )
      case 'driver':
        return (
          <>
            <Link to="/driver" className="hover:text-primary-500 transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <span className="text-gray-500 text-sm">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
          </>
        )
      default:
        return null
    }
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
            <MdDeliveryDining className="text-3xl" />
            Foodies
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks()}
          </div>

          <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-4">
            {navLinks()}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
