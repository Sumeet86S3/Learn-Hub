const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser())

const authRoute = require('./routes/auth.route.js')
const coursesRoute = require('./routes/courses.route.js')
app.use(express.json())


app.use('/api/auth',authRoute)
app.use('/api/courses',coursesRoute)


module.exports = app


