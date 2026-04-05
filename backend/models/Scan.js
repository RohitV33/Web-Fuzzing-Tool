const mongoose = require('mongoose')

const resultSchema = new mongoose.Schema({
  url:     { type: String, required: true },
  path:    { type: String, required: true },
  status:  { type: Number, required: true },
  size:    { type: Number, default: 0 },
  time:    { type: Number, default: 0 },
  payload: { type: String, default: null },
  vulnerability: {
    type:     { type: String },
    severity: { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'] },
  },
  timestamp: { type: Date, default: Date.now },
}, { _id: false })

const scanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Config
  targetUrl:    { type: String, required: true },
  scanMode:     { type: String, enum: ['dir', 'vuln', 'param', 'deep'], default: 'dir' },
  wordlistKey:  { type: String, default: 'common' },
  threads:      { type: Number, default: 10, min: 1, max: 50 },
  extensions:   [{ type: String }],
  excludeStatus:{ type: String, default: '404' },

  // Status
  status: {
    type: String,
    enum: ['queued', 'running', 'paused', 'completed', 'failed', 'aborted'],
    default: 'queued',
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },

  // Results
  results: [resultSchema],

  // Stats
  stats: {
    total:  { type: Number, default: 0 },
    found:  { type: Number, default: 0 },
    errors: { type: Number, default: 0 },
    vulns:  { type: Number, default: 0 },
  },

  startedAt:   { type: Date },
  completedAt: { type: Date },
  duration:    { type: Number },  // ms
  error:       { type: String },
  report:      { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
}, {
  timestamps: true,
})

// Index for fast lookups
scanSchema.index({ user: 1, createdAt: -1 })
scanSchema.index({ status: 1 })

module.exports = mongoose.model('Scan', scanSchema)
