const router = require('express').Router()
const { getWordlists, getWordlist } = require('../controllers/wordlistController')
const { protect } = require('../middleware/auth')

router.get('/',     protect, getWordlists)
router.get('/:key', protect, getWordlist)

module.exports = router
