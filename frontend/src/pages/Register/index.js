import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import api from '../../services/api'

import './index.css'

const Register = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('attendee')

  const onSubmitForm = async event => {
    event.preventDefault()

    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        role,
      })

      alert('Registered Successfully')

      navigate('/')
    } catch (error) {
      alert(error.response.data)
    }
  }

  return (
    <div className="login-container">
      <form className="form-card" onSubmit={onSubmitForm}>
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
        </select>

        <button type="submit">Register</button>

        <Link to="/">Already User?</Link>
      </form>
    </div>
  )
}

export default Register