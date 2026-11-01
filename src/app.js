const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const allowedOrigins = (
    process.env.CORS_ORIGINS ||
    'http://localhost:5173,http://127.0.0.1:5173'
).split(',').map(origin => origin.trim()).filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(cookieParser())

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
})

const authRoute = require('./routes/auth.route.js')
const coursesRoute = require('./routes/courses.route.js')
const enrollmentsRoute = require('./routes/enrollments.route.js')
const reviewsRoute = require('./routes/reviews.route.js')
app.use(express.json())


app.use('/api/auth',authRoute)
app.use('/api/courses',coursesRoute)
app.use('/api/enrollments',enrollmentsRoute)
app.use('/api/reviews',reviewsRoute)


module.exports = app
