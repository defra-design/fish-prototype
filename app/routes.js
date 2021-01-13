const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// the bit between '' is the reference for this code, linked to from the form action
router.post('/check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect('gafl/licence-by')
  } else {
    res.redirect('gafl/contact-preference')
  }
})

router.post('/check-change-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    res.redirect('gafl/licence-by')
  } else {
    res.redirect('gafl/contact-summary')
  }
})

// router.post('/check-change-licence-type', function (req, res) {
//   // Make a variable from session data
//   let licenceOption = req.session.data['licence-option']
//   // route depending on value
//   if (licenceOption === 'digital') {
//     res.redirect('gafl/check-email')
//   } else {
//     res.redirect('gafl/contact-summary')
//   }
// })

module.exports = router
