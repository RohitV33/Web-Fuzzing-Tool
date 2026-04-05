const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' })
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      return res.status(400).json({ error: 'Username or email already taken' })
    }

    const user = await User.create({ username, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    const token = signToken(user._id)
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

const getMe = async (req, res) => {
  const user = req.user
  res.json({ id: user._id, username: user.username, email: user.email, role: user.role, scansCount: user.scansCount, createdAt: user.createdAt })
}

const updateMe = async (req, res, next) => {
  try {
    const { username, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true }
    )
    res.json({ id: user._id, username: user.username, email: user.email })
  } catch (err) {
    next(err)
  }
}

const googleAuthHandler = async (profile) => {
  let user = await User.findOne({ googleId: profile.id })
  if (user) {
    user.lastLogin = new Date()
    await user.save()
    return user
  }

  const email = profile.emails?.[0]?.value
  user = await User.findOne({ email })
  if (user) {
    user.googleId = profile.id
    user.authProvider = 'google'
    user.lastLogin = new Date()
    await user.save()
    return user
  }

  const baseUsername = profile.displayName?.replace(/\s+/g, '_').toLowerCase() || `user_${Date.now()}`
  let username = baseUsername
  const existing = await User.findOne({ username })
  if (existing) username = `${baseUsername}_${Date.now()}`

  user = await User.create({
    googleId:     profile.id,
    username,
    email,
    avatar:       profile.photos?.[0]?.value || null,
    authProvider: 'google',
    lastLogin:    new Date(),
  })

  return user
}

module.exports = { register, login, getMe, updateMe, signToken, googleAuthHandler }