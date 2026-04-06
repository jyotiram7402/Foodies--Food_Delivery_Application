import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { onboardDriver } from '../../api/api'
import toast from 'react-hot-toast'
import { MdDeliveryDining, MdAccessTime, MdLocationOn, MdCheckCircle } from 'react-icons/md'

function DriverDashboard() {
  const { user } = useAuth()
  const [registered, setRegistered] = useState(false)
  const [driverInfo, setDriverInfo] = useState(null)
  const [form, setForm] = useState({
    driverOnlineFrom: '08:00:00',
    driverOnlineTill: '20:00:00',
    startAddress: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.startAddress) {
      toast.error('Please enter your start address')
      return
    }
    setSubmitting(true)
    try {
      const res = await onboardDriver(form)
      toast.success(`Registered! Driver ID: ${res.data.driverId}`)
      setDriverInfo(res.data)
      setRegistered(true)
    } catch (err) {
      toast.error('Failed to register. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Driver Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome, {user?.name}</p>

      {registered ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <MdCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You're All Set!</h2>
          <p className="text-gray-500 mb-6">
            Driver ID: <span className="font-semibold text-primary-600">#{driverInfo?.driverId}</span>
          </p>
          <div className="bg-gray-50 rounded-lg p-6 max-w-sm mx-auto text-left space-y-3">
            <div className="flex items-center gap-3">
              <MdAccessTime className="text-primary-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Online Hours</p>
                <p className="font-semibold">{form.driverOnlineFrom} - {form.driverOnlineTill}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MdLocationOn className="text-primary-500 text-xl" />
              <div>
                <p className="text-xs text-gray-500">Start Location</p>
                <p className="font-semibold">{form.startAddress}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            You will be automatically assigned orders based on your location and availability.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
              <MdDeliveryDining className="text-primary-600 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Driver Registration</h2>
              <p className="text-sm text-gray-500">Set your availability and start location</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online From</label>
                <input
                  type="text"
                  value={form.driverOnlineFrom}
                  onChange={(e) => setForm({ ...form, driverOnlineFrom: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="08:00:00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Online Till</label>
                <input
                  type="text"
                  value={form.driverOnlineTill}
                  onChange={(e) => setForm({ ...form, driverOnlineTill: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="20:00:00"
                  required
                />
              </div>
            </div>
            <p className="text-xs text-gray-400">Time format: HH:MM:SS (e.g., 08:00:00)</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Address</label>
              <input
                type="text"
                value={form.startAddress}
                onChange={(e) => setForm({ ...form, startAddress: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Your starting location address"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Start Driving'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default DriverDashboard
