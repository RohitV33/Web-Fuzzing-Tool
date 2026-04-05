const router = require('express').Router()
const { getReports, getReport, deleteReport, exportReport , getReportByScanId} = require('../controllers/reportController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/',           getReports)
router.get('/scan/:id',   getReportByScanId)
router.get('/:id',        getReport)
router.get('/:id/export', exportReport)
router.delete('/:id',     deleteReport)

module.exports = router