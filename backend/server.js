const express = require("express")
const path = require("path")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const QRCode = require("qrcode")
const fs = require("fs")

const dbPath = path.join(__dirname, "database/eventManager.db")

const app = express()

app.use(express.json())
app.use(cors())

let db = null

const initializeDBAndServer = async () => {
  try {

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    const schemaPath = path.join(__dirname, "schema.sql")

    const schema = fs.readFileSync(schemaPath, "utf8")

    await db.exec(schema)

    const PORT = process.env.PORT || 5000;

   app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});

  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(-1)
  }
}

initializeDBAndServer()

const authenticateToken = (request, response, next) => {

  const authHeader = request.headers["authorization"]

  let jwtToken

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1]
  }

  if (jwtToken === undefined) {

    response.status(401)
    response.send("Invalid Access Token")

  } else {

    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {

      if (error) {
        response.status(401)
        response.send("Invalid Access Token")
      } else {
        request.userId = payload.id
        request.role = payload.role
        next()
      }
    })
  }
}

app.get("/", (request, response) => {
  response.send("Backend Running Successfully")
})

/*
REGISTER API
*/

app.post("/api/auth/register", async (request, response) => {

  const {name, email, password, role} = request.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const selectUserQuery = `
    SELECT * FROM users
    WHERE email='${email}';
  `

  const dbUser = await db.get(selectUserQuery)

  if (dbUser === undefined) {

    const createUserQuery = `
      INSERT INTO users(
        name,
        email,
        password,
        role
      )
      VALUES(
        '${name}',
        '${email}',
        '${hashedPassword}',
        '${role}'
      );
    `

    await db.run(createUserQuery)

    response.send("User Created Successfully")

  } else { 

    response.status(400)
    response.send("User Already Exists")
  }
})

/*
LOGIN API
*/

app.post("/api/auth/login", async (request, response) => {

  const {email, password} = request.body

  const selectUserQuery = `
    SELECT * FROM users
    WHERE email='${email}';
  `

  const dbUser = await db.get(selectUserQuery)

  if (dbUser === undefined) {

    response.status(400)
    response.send("Invalid User")

  } else {

    const isPasswordMatched = await bcrypt.compare(
      password,
      dbUser.password
    )

    if (isPasswordMatched === true) {

      const payload = {
        id: dbUser.id,
        role: dbUser.role,
      }

      const jwtToken = jwt.sign(
        payload,
        "MY_SECRET_TOKEN"
      )

      response.send({jwtToken})

    } else {

      response.status(400)
      response.send("Invalid Password")
    }
  }
})

/*
CREATE EVENT API
*/

app.post(
  "/api/events",
  authenticateToken,
  async (request, response) => {

    const {
      title,
      description,
      location,
      date,
      capacity,
    } = request.body

    const createEventQuery = `  
      INSERT INTO events(
        title,
        description,
        location,
        date,
        capacity,
        organizer_id
      )
      VALUES(
        '${title}',
        '${description}',
        '${location}',
        '${date}',
        ${capacity},
        ${request.userId}
      );
    `

    await db.run(createEventQuery)

    response.send("Event Created Successfully")
  }
)

/*
GET EVENTS API
*/

app.get('/api/events', async (request, response) => {
  const getEventsQuery = `
    SELECT 
      events.*, 
      (
        events.capacity - COUNT(tickets.id)
      ) AS remaining_seats
    FROM events
    LEFT JOIN tickets
    ON events.id = tickets.event_id
    GROUP BY events.id;
  `

  const events = await db.all(getEventsQuery)

  response.send(events)
})

/*
GET SINGLE EVENT API
*/

app.get("/api/events/:id", async (request, response) => {

  const {id} = request.params

  const getEventQuery = `
    SELECT * FROM events
    WHERE id=${id};
  `

  const event = await db.get(getEventQuery)

  response.send(event)
})

/*
BOOK TICKET API
*/

app.post(
  "/api/book-ticket",
  authenticateToken,
  async (request, response) => {

    const {eventId} = request.body

    const existingBookingQuery = `
      SELECT * FROM tickets
      WHERE user_id=${request.userId}
      AND event_id=${eventId};
    `

    const existingBooking = await db.get(existingBookingQuery)

    if (existingBooking) {
      response.status(400)
      response.send("Duplicate Booking Not Allowed")
      return
    }

    const getEventQuery = `
      SELECT * FROM events
      WHERE id=${eventId};
    `

    const event = await db.get(getEventQuery)

    const bookedCountQuery = `
      SELECT COUNT(*) as total
      FROM tickets
      WHERE event_id=${eventId};
    `

    const bookedCount = await db.get(bookedCountQuery)

    if (bookedCount.total >= event.capacity) {
      response.status(400)
      response.send("Event Full")
      return
    } 


    const qrCode = await QRCode.toDataURL(
      `User:${request.userId}-Event:${eventId}`
    )

    const createTicketQuery = `
      INSERT INTO tickets(
        user_id,
        event_id,
        qr_code
      )
      VALUES(
        ${request.userId},
        ${eventId},
        '${qrCode}'
      );
    `

    await db.run(createTicketQuery)

    response.send({
      message: "Ticket Booked Successfully",
      qrCode,
    })
  }
)


/*
GET MY TICKETS API
*/

app.get(
  "/api/tickets",
  authenticateToken,
  async (request, response) => {

    const getTicketsQuery = `
      SELECT * FROM tickets
      WHERE user_id=${request.userId};
    `

    const tickets = await db.all(getTicketsQuery)

    response.send(tickets)
  }
)

app.get('/api/events/:id/attendees', async (request, response) => {
  const {id} = request.params

  const getAttendeesQuery = `
    SELECT 
      users.id,
      users.name,
      users.email
    FROM tickets
    INNER JOIN users
    ON tickets.user_id = users.id
    WHERE tickets.event_id = ${id};
  `

  const attendees = await db.all(getAttendeesQuery)

  response.send(attendees)
})

app.get('/api/profile', authenticateToken, async (request, response) => {
  const getUserQuery = `
    SELECT id, name, email, role
    FROM users
    WHERE id=${request.userId};
  `

  const user = await db.get(getUserQuery)

  response.send(user)
})
