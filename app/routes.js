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

router.post('/multibuy-check-licence-type', function (req, res) {
  // Make a variable from session data
  let licenceType = req.session.data['licence-type']
  // route depending on value
  // i am not sure why we have this…
  if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect('gafl-multibuy/licence-summary')
  } else if (licenceType === 'Salmon and sea trout') {
    res.redirect('gafl-multibuy/licence-length?rcr=true')
  } else {
    res.redirect('gafl-multibuy/licence-length')
  }
})

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

// check to route someone who wants to buy other licence
router.post('/multibuy-add-licences', function (req, res) {
  // Make a variable from session data
  let addLicence = req.session.data['add-licence']
  // route depending on value
  if (addLicence === 'yes') {
    // another licence
    res.redirect('gafl-multibuy/who-is-this-licence-for?source=multibuy?licence-for=')
  } else {
    // finish up
    res.redirect('gafl-multibuy/terms-conditions')
  }
})

// logic for when other licence is bought,
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
  let lastLicenceFor = req.session.data['licence-was-for']

  // if I have just started
  if (source === 'gafl') {
    // new licence, ask all the questions
    res.redirect('gafl-multibuy/name')

  // multi-buy
  } else {

    // work out if we need to skip the details that already exists

    // if the licence is for the named Angler
    // skip questions / angler = same
    // licence for other
    // reset source to gafl
    if (licenceFor == 'same-other') {

      // licence is for the same angler, other person
      res.redirect('gafl-multibuy/start-kind?source=gafl&angler=same&licence-for=other')

    // if the licence is for 'other' (not named)
    // licence is for other
    // ask all the questions
    } else if (licenceFor == 'other') {

      // licence is for the new angler, other person
      // reset source to gafl
      res.redirect('gafl-multibuy/name?source=gafl&angler=new&licence-for=other')

    // if the licence is for the user
    // and the last one was for user
    // licence for user
    // skip questions / angler = same
    } else {

      // licence is for 'user'
      // has the user entered information about you before?
      if (lastLicenceFor == 'you') {

        // YES

        // licence is for the same angler, the user
        // reset source to gafl
        res.redirect('gafl-multibuy/start-kind?source=gafl&angler=new&licence-for=user')

      } else {

        // NO

        // licence is for the user, last round was not the user
        res.redirect('gafl-multibuy/name?source=gafl&angler=new&licence-for=user')

      }

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
