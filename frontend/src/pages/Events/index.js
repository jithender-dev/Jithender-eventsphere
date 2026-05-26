import {useEffect, useState} from 'react'
import Navbar from '../../components/Navbar'
import api from '../../services/api'

import './index.css'

const Events = () => {
  const [events, setEvents] = useState([])
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    getEvents()
  }, [])

  const getEvents = async () => {
    try {
      const response = await api.get('/api/events')

      setEvents(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const onClickBookTicket = async eventId => {
    const token = localStorage.getItem('token')

    try {
      const response = await api.post(
        '/api/book-ticket',
        {
          eventId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert(response.data.message)

      getEvents()
    } catch (error) {
      alert(error.response.data)
    }
  }

  const filteredEvents = events.filter(eachEvent =>
    eachEvent.title.toLowerCase().includes(searchInput.toLowerCase()),
  )

  return (
    <>
      <Navbar />

      <div className="events-page">
        <div className="hero-section">
          <h1 className="hero-heading">
            Discover Amazing Events Around You
          </h1>

          <p className="hero-description">
            Book tickets instantly and experience the best tech, music,
            startup, and gaming events.
          </p>
        </div>

        <div className="search-container">
          <input
            type="search"
            placeholder="Search Events..."
            className="search-input"
            value={searchInput}
            onChange={event => setSearchInput(event.target.value)}
          />
        </div>

        <h1 className="events-title">Trending Events</h1>

        <div className="events-list">
          {filteredEvents.map(eachEvent => (
            <div className="event-card" key={eachEvent.id}>
              <div className="event-top">
                <span className="event-badge">LIVE EVENT</span>

                <h2>{eachEvent.title}</h2>

                <p className="event-description">
                  {eachEvent.description}
                </p>
              </div>

              <div className="event-details">
  <p>
    📍 <strong>{eachEvent.location}</strong>
  </p>

  <p>📅 {eachEvent.date}</p>

  <p>🎟 Total Seats: {eachEvent.capacity}</p>

  <p>
    🪑 Remaining Seats:{' '}
    {eachEvent.remaining_seats}
  </p>

  <p>
    🔥 Booked Seats:{' '}
    {eachEvent.capacity - eachEvent.remaining_seats}
  </p>

  <div className="capacity-bar-container">
    <div
      className="capacity-bar"
      style={{
        width: `${
          ((eachEvent.capacity -
            eachEvent.remaining_seats) /
            eachEvent.capacity) *
          100
        }%`,
      }}
    />
  </div>

  <p className="capacity-text">
    {Math.floor(
      ((eachEvent.capacity -
        eachEvent.remaining_seats) /
        eachEvent.capacity) *
        100,
    )}
    % Full
  </p>
</div>

              <button
                type="button"
                className="book-button"
                disabled={eachEvent.remaining_seats === 0}
                onClick={() => onClickBookTicket(eachEvent.id)}
              >
                {eachEvent.remaining_seats === 0
                  ? 'Event Full'
                  : 'Book Ticket'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Events