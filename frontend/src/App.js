import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

import './App.css'

const ProtectedRoute = ({children}) => {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" />
  }

  return children
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
)

export default App