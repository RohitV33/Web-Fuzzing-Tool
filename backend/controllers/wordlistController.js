const { WORDLISTS, SCAN_MODES } = require('../config/payloads')

// GET /api/wordlists
const getWordlists = (req, res) => {
  const lists = Object.entries(WORDLISTS).map(([key, words]) => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    count: words.length,
    preview: words.slice(0, 5),
  }))
  res.json({ wordlists: lists, scanModes: SCAN_MODES })
}

// GET /api/wordlists/:key
const getWordlist = (req, res) => {
  const key   = req.params.key
  const words = WORDLISTS[key]
  if (!words) return res.status(404).json({ error: 'Wordlist not found' })
  res.json({ key, count: words.length, words })
}

module.exports = { getWordlists, getWordlist }
