const router = require('express').Router()
const passport = require('passport')

const { register, login, getMe, updateMe, signToken } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'

// Normal auth
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)

// Google auth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=google_failed`
  }),
  (req, res) => {
    const token = signToken(req.user._id)
    res.redirect(`${CLIENT_URL}/auth-success?token=${token}`)
  }
)

module.exports = router