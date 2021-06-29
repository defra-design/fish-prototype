const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line



// GAFL routes
/////////////////////////////////////////////////////////////

router.post('/check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceType = req.session.data['licence-type']
  // route depending on value
  // i am not sure why we have this…
  if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect('gafl/licence-summary')
  } else if (licenceType === 'Salmon and sea trout') {
    res.redirect('gafl/licence-length?rcr=true')
  } else {
    res.redirect('gafl/licence-length')
  }
})

// routing for digital/paper licence
router.post('/check-licence-option', function (req, res) {
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



// Multibuy routes
/////////////////////////////////////////////////////////////

router.post('/multibuy-check-licence-option', function (req, res) {
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

// check to route someone who wants to buy another licence
router.post('/multibuy-add-licences', function (req, res) {
  // Make a variable from session data
  let anotherLicence = req.session.data['add-licence']
  // route depending on value
  if (anotherLicence === 'yes') {
    // res.redirect('gafl-multibuy/same-licence-holder?licences=1')
    res.redirect('gafl-multibuy/who-is-this-licence-for?source=multibuy')
  } else {
    res.redirect('gafl-multibuy/terms-conditions')
  }
})

// logic for when another licence is bought,
// is the licence for the same user?
// who is that user?

// if you say it is for you
// and you were the last person
// then angler is same

// if you say it is for you
// and you were not the last person
// then angler is same

// if you say other
// how can we know it is the same other?
// check name?

router.post('/licence-for', function (req, res) {

  // Make a variable from session data
  let source = req.session.data['source']
  let licenceFor = req.session.data['licence-for']

  // if I have just started
  if (source === 'gafl') {
    // new licence, ask all the questions
    res.redirect('gafl-multibuy/name')

  // multi-buy
  } else {

    // work out if we need to skip the details that already exists

    // if the licence is for the named Angler
    // skip questions / angler = same
    // licence for another
    // reset source to gafl
    if (licenceFor == 'same-another') {

      // licence is for the same angler, another person
      res.redirect('gafl-multibuy/start-kind?source=gafl&angler=same&licence-for=another')

    // if the licence is for another (not named)
    // licence is for another
    // ask all the questions
    } else if (licenceFor == 'another') {

      // licence is for the new angler, another person
      // reset source to gafl
      res.redirect('gafl-multibuy/name?source=gafl&angler=new&licence-for=another')

    // if the licence is for the user
    // and the last one was for user
    // licence for user
    // skip questions / angler = same
    } else {

      // licence is for the same angler, the user
      // reset source to gafl
      res.redirect('gafl-multibuy/start-kind?source=gafl&angler=same&licence-for=user')

    }

  }

})




// Renew routes
/////////////////////////////////////////////////////////////

// additional routing for renew
router.post('/renew-check-licence-option', function (req, res) {
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
