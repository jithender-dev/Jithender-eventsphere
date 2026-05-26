import {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

import './index.css'

const Profile = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (user === null) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-card">
          <div className="avatar-circle">
            {user.name[0]}
          </div>

          <h1>{user.name}</h1>

          <p>{user.email}</p>

          <div className="profile-info">
            <div className="info-box">
              <h2>Role</h2>

              <p>{user.role}</p>
            </div>

            <div className="info-box">
              <h2>User ID</h2>

              <p>{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile