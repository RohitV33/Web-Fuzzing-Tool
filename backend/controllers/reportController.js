const Report = require('../models/Report')

// GET /api/reports
const getReports = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 10
    const skip  = (page - 1) * limit

    const [reports, total] = await Promise.all([
      Report.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('scan', 'targetUrl scanMode status duration')
        .select('-findings'),
      Report.countDocuments({ user: req.user._id }),
    ])

    res.json({ reports, total, page, pages: Math.ceil(total / limit) })
  } catch (err) { next(err) }
}

// GET /api/reports/:id
const getReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id })
      .populate('scan', 'targetUrl scanMode status duration startedAt completedAt')
    if (!report) return res.status(404).json({ error: 'Report not found' })
    res.json(report)
  } catch (err) { next(err) }
}

// DELETE /api/reports/:id
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, user: req.user._id })
    if (!report) return res.status(404).json({ error: 'Report not found' })
    res.json({ message: 'Report deleted' })
  } catch (err) { next(err) }
}

// GET /api/reports/:id/export?format=json|csv
const exportReport = async (req, res, next) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, user: req.user._id })
    if (!report) return res.status(404).json({ error: 'Report not found' })

    const fmt = req.query.format || 'json'

    if (fmt === 'csv') {
      const headers = 'ID,Type,Severity,URL,Path,Parameter,Status,CWE,Description\n'
      const rows = report.findings.map((f, i) =>
        `${i + 1},"${f.type}",${f.severity},"${f.url}","${f.path}","${f.parameter || ''}",${f.status || ''},"${f.cve || ''}","${f.description?.replace(/"/g, '""') || ''}"`
      ).join('\n')
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename="vulnscan-report-${report._id}.csv"`)
      return res.send(headers + rows)
    }

    // JSON export
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="vulnscan-report-${report._id}.json"`)
    res.json({
      report: {
        id:        report._id,
        title:     report.title,
        target:    report.target,
        generated: report.createdAt,
        summary:   report.summary,
        findings:  report.findings,
      }
    })
  } catch (err) { next(err) }
}

// GET /api/reports/scan/:id  — find report by scan ID
const getReportByScanId = async (req, res, next) => {
  try {
    const report = await Report.findOne({ scan: req.params.id, user: req.user._id })
      .populate('scan', 'targetUrl scanMode status duration startedAt completedAt')
    if (!report) return res.status(404).json({ error: 'Report not found for this scan' })
    res.json(report)
  } catch (err) { next(err) }
}

module.exports = { getReports, getReport, deleteReport, exportReport, getReportByScanId }
