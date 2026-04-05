require('dotenv').config()

const express     = require('express')
const cors        = require('cors')
const helmet      = require('helmet')
const morgan      = require('morgan')
const compression = require('compression')
const rateLimit   = require('express-rate-limit')
const passport    = require('passport')

require('./config/passport')

const connectDB   = require('./config/db')

const authRoutes      = require('./routes/auth')
const scanRoutes      = require('./routes/scans')
const reportRoutes    = require('./routes/reports')
const wordlistRoutes  = require('./routes/wordlists')
const statsRoutes     = require('./routes/stats')

const { errorHandler, notFound } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(helmet({ crossOriginEmbedderPolicy: false }))
app.use(compression())

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use(passport.initialize())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
})

const scanLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 500,
})

app.use('/api/auth', authRoutes)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.use('/api/scans', scanLimiter, scanRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/wordlists', wordlistRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`\n🚀 VulnScan API running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔑 JWT configured: ${!!process.env.JWT_SECRET}`)
  console.log(`🗄️ MongoDB: ${process.env.MONGO_URI}\n`)
})

module.exports = app