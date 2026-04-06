import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Restaurants from './pages/user/Restaurants'
import RestaurantMenu from './pages/user/RestaurantMenu'
import MyOrders from './pages/user/MyOrders'
import MerchantDashboard from './pages/merchant/MerchantDashboard'
import DriverDashboard from './pages/driver/DriverDashboard'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/restaurants" element={
            <ProtectedRoute allowedRoles={['user']}>
              <Restaurants />
            </ProtectedRoute>
          } />
          <Route path="/restaurants/:id/menu" element={
            <ProtectedRoute allowedRoles={['user']}>
              <RestaurantMenu />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['user']}>
              <MyOrders />
            </ProtectedRoute>
          } />

          <Route path="/merchant" element={
            <ProtectedRoute allowedRoles={['merchant']}>
              <MerchantDashboard />
            </ProtectedRoute>
          } />

          <Route path="/driver" element={
            <ProtectedRoute allowedRoles={['driver']}>
              <DriverDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
