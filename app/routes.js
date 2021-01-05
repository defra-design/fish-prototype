const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line


// GAFL routing for the question about where you want your licence to be sent
router.post('/views/gafl/licence-by-question', function (req, res) {

  let licenceBy = req.session.data['licence-by']

  if (licenceBy === 'email') {
    res.redirect('/gafl/contact-preference')
  } else {
    res.redirect('/gafl/contact-preference')
  }
})

module.exports = router
