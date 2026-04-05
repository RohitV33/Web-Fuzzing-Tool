const mongoose = require('mongoose')

const findingSchema = new mongoose.Schema({
  type:        { type: String, required: true },
  severity:    { type: String, enum: ['critical', 'high', 'medium', 'low', 'info'], required: true },
  url:         { type: String, required: true },
  path:        { type: String, required: true },
  parameter:   { type: String, default: null },
  payload:     { type: String, default: null },
  status:      { type: Number },
  description: { type: String },
  recommendation: { type: String },
  cve:         { type: String },
  timestamp:   { type: Date, default: Date.now },
}, { _id: false })

const reportSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scan:    { type: mongoose.Schema.Types.ObjectId, ref: 'Scan', required: true },
  title:   { type: String, default: 'VulnScan Security Report' },
  target:  { type: String, required: true },

  findings: [findingSchema],

  summary: {
    critical: { type: Number, default: 0 },
    high:     { type: Number, default: 0 },
    medium:   { type: Number, default: 0 },
    low:      { type: Number, default: 0 },
    riskScore:{ type: Number, default: 0 },
  },
}, {
  timestamps: true,
})


reportSchema.index({ user: 1, createdAt: -1 })

module.exports = mongoose.model('Report', reportSchema)
