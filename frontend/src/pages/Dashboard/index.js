import {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

import './index.css'

const Dashboard = () => {
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    getTickets()
  }, [])

  const getTickets = async () => {
    const token = localStorage.getItem('token')

    try {
      const response = await api.get('/api/tickets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setTickets(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Navbar />

      <div className="dashboard-page">
        <div className="dashboard-hero">
          <h1 className="dashboard-heading">
            Your Event Tickets Dashboard
          </h1>

          <p className="dashboard-description">
            Access your booked tickets and QR passes instantly.
          </p>
        </div>

        <div className="stats-card">
          <h2>Total Tickets Booked</h2>

          <p className="stats-number">{tickets.length}</p>
        </div>

        <h1 className="tickets-heading">My Tickets</h1>

        <div className="tickets-list">
          {tickets.map(eachTicket => (
            <div className="ticket-card" key={eachTicket.id}>
              <div className="ticket-top">
                <span className="ticket-badge">CONFIRMED</span>

                <h2>Event ID #{eachTicket.event_id}</h2>
              </div>

              <img
                src={eachTicket.qr_code}
                alt="qr code"
                className="qr-image"
              />

              <button type="button" className="download-button">
                View Pass
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard