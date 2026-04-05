const Scan   = require('../models/Scan')
const Report = require('../models/Report')

// GET /api/stats/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id

    const [
      totalScans,
      completedScans,
      runningScans,
      totalReports,
      recentScans,
      vulnCounts,
    ] = await Promise.all([
      Scan.countDocuments({ user: userId }),
      Scan.countDocuments({ user: userId, status: 'completed' }),
      Scan.countDocuments({ user: userId, status: 'running' }),
      Report.countDocuments({ user: userId }),
      Scan.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('targetUrl status scanMode stats createdAt duration'),
      Report.aggregate([
        { $match: { user: userId } },
        { $group: {
          _id: null,
          critical: { $sum: '$summary.critical' },
          high:     { $sum: '$summary.high' },
          medium:   { $sum: '$summary.medium' },
          low:      { $sum: '$summary.low' },
        }},
      ]),
    ])

    const vulns = vulnCounts[0] || { critical: 0, high: 0, medium: 0, low: 0 }

    // Scan activity last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const activityRaw = await Scan.aggregate([
      { $match: { user: userId, createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ])

    res.json({
      totalScans,
      completedScans,
      runningScans,
      totalReports,
      vulnerabilities: { ...vulns, _id: undefined },
      recentScans,
      scanActivity: activityRaw,
    })
  } catch (err) { next(err) }
}

module.exports = { getDashboardStats }
