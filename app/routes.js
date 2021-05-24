const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line

// the bit between '' is the reference for this code, linked to from the form action
router.post('/check-licence-length', function (req, res) {
  // Make a variable from session data
  let licenceType = req.session.data['licence-type']
  // route depending on value
  // i am not sure why we have this…
  if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect('gafl/contact-summary')
  } else {
    res.redirect('gafl/licence-length')
  }
})

// routing for digital/paper licence
router.post('/check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect('gafl/licence-by')
  } else {
    res.redirect('gafl/licence-confirmation')
  }
})

router.post('/multibuy-check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect('gafl-multibuy/licence-by')
  } else {
    res.redirect('gafl-multibuy/licence-confirmation')
  }
})

router.post('/multibuy-add-licences', function (req, res) {
  // Make a variable from session data
  let anotherLicence = req.session.data['add-licence']
  // route depending on value
  if (anotherLicence === 'yes') {
    // res.redirect('gafl/add-email')
    // if (licence === "0") {
    //   res.redirect('gafl-multibuy/dob?licence=1')
    // elseif (licence === "1")
    //   res.redirect('gafl-multibuy/dob?licence=2')
    // else (licence === "2")
    //   res.redirect('gafl-multibuy/dob?licence=3')
    // }
    res.redirect('gafl-multibuy/dob?licence=1')
  } else {
    res.redirect('gafl-multibuy/terms-conditions')
  }
})

// additional routing for renew
router.post('/renew-check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect('renew/licence-by')
  } else {
    res.redirect('renew/licence-confirmation')
  }
})


// routing for changed digital/paper licence
router.post('/check-change-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    res.redirect('gafl/change-licence-by')
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
