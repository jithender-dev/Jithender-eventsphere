import {Link, useNavigate} from 'react-router-dom'

import './index.css'

const Navbar = () => {
  const navigate = useNavigate()

  const onClickLogout = () => {
    localStorage.removeItem('token')

    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>EventSphere</h1>
      </div>

      <div className="navbar-links">
        <Link to="/events" className="nav-link">
          Events
        </Link>

        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>

        <Link to="/profile" className="nav-link">
          Profile
        </Link>

        <button
          type="button"
          className="logout-button"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar