const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: false,      // ← OAuth users ka password nahi hoga
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },

  // OAuth fields
  googleId: { type: String, default: null },
  githubId: { type: String, default: null },
  avatar:   { type: String, default: null },
  authProvider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  scansCount: { type: Number, default: 0 },
  lastLogin:  { type: Date },
}, {
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false  
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema)