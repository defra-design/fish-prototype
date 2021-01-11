const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// GAFL routing for what the licence type is (3 rods means only 12 months is valid)
router.post('/views/gafl/route-licence-type', function (req, res) {

  let licenceType = req.session.data['licence-type']

  if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect('views/gafl/licence-summary')
  } else {
    res.redirect('views/gafl/licence-length')
  }
})


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
