import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../api/api'
import toast from 'react-hot-toast'
import { MdDeliveryDining } from 'react-icons/md'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    userType: 'user',
    address: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password || !form.address) {
      toast.error('Please fill in all fields')
      return
    }
    setSubmitting(true)
    try {
      await registerUser(form.userType, form)
      toast.success('Registration successful! Logging you in...')
      const userData = await login(form.email, form.password)
      switch (userData.userType) {
        case 'user':
          navigate('/restaurants')
          break
        case 'merchant':
          navigate('/merchant')
          break
        case 'driver':
          navigate('/driver')
          break
        default:
          navigate('/')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const roleLabels = {
    user: { label: 'Customer', desc: 'Order food from restaurants', color: 'primary' },
    merchant: { label: 'Merchant', desc: 'List your restaurant & menu', color: 'green' },
    driver: { label: 'Driver', desc: 'Deliver food & earn money', color: 'blue' },
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <div className="text-center mb-6">
          <MdDeliveryDining className="text-primary-500 text-5xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500">Join Foodies today</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(roleLabels).map(([key, val]) => (
            <button
              key={key}
              type="button"
              onClick={() => setForm({ ...form, userType: key })}
              className={`p-3 rounded-lg border-2 text-center transition ${
                form.userType === key
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-sm">{val.label}</div>
              <div className="text-xs mt-1 text-gray-500">{val.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="9876543210"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Create a strong password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="123 Main Street, City, State"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
