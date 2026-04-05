const router = require('express').Router()
const { startScan, getScans, getScan, getScanStatus, stopScan, deleteScan } = require('../controllers/scanController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/',            startScan)
router.get ('/',            getScans)
router.get ('/:id',         getScan)
router.get ('/:id/status',  getScanStatus)
router.post('/:id/stop',    stopScan)
router.delete('/:id',       deleteScan)

module.exports = router
