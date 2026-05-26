import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

import api from '../../services/api'

import './index.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const onSubmitForm = async event => {
    event.preventDefault()

    const userDetails = {
      email,
      password,
    }

    try {
      const response = await api.post('/api/auth/login', userDetails)

      localStorage.setItem('token', response.data.jwtToken)

      navigate('/events')
    } catch (error) {
      alert(error.response?.data || 'Login Failed')
    }
  }

  return (
    <div className="login-bg-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="app-title">EventSphere</h1>

          <p className="app-description">
            Smart Event Management & Ticket Booking Platform
          </p>

          <div className="logo-circle">
            <h1 className="logo-text">Events</h1>
          </div>

          <h2 className="brand-name">EventSphere</h2>

          <p className="brand-tagline">
            Create • Manage • Experience
          </p>
        </div>

        <form className="login-form" onSubmit={onSubmitForm}>
          <h1 className="login-heading">Welcome Back</h1>

          <label className="label">Email</label>

          <input
            type="email"
            className="input"
            placeholder="Enter Email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />

          <label className="label">Password</label>

          <input
            type="password"
            className="input"
            placeholder="Enter Password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="bottom-text">
            New User?{' '}
            <Link to="/register" className="register-link">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login