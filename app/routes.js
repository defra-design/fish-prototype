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
router.post('/multibuy-add-licence', function (req, res) {

  // make variables from the session data
  let licences = req.session.data['licences']
  let allLicences = req.session.data['allLicences']

  let firstName = req.session.data['firstName']
  let lastName = req.session.data['last-name']
  let type = req.session.data['licence-type']
  let length = req.session.data['licence-length']
  let concession = req.session.data['concession']


  // make an object to hold the data
  let lastLicenceData = {
    firstName,
    lastName,
    type,
    length,
    concession
  };

  // add the data to an object called licences
  allLicences.push(lastLicenceData);

  // increment licence numbers
  if (licences === 1) {
    req.session.data.licences = 2;
  } else if (licences === 2) {
    req.session.data.licences = 3;
  } else if (licences === 3) {
    req.session.data.licences = 4;
  } else if (licences > 3) {
    req.session.data.licences = 5; // hardcoded max of 5
  } else {
    req.session.data.licences = 1;
  }

  // go to the screen that asks if you want another licence
  res.redirect('gafl-multibuy/add-another-licence')

})


// check to route someone who wants to buy other licence
router.post('/multibuy-add-licences', function (req, res) {

  // Make a variable from session data
  let addLicence = req.session.data['add-licence']
  let newTerms = req.session.data['terms']

  if (addLicence) {

    // move variables used in the flow into memory

    // declare the object holding the data
    let allLicences = req.session.data['allLicences?error=']

    // route depending on value
    if (addLicence === 'yes') {
      // another licence

      req.session.data.source = 'multibuy';
      // req.session.data.licenceFor = '';

      // rename variables and use server side changes

      // redirect, clears variables
      res.redirect('gafl-multibuy/who-is-this-licence-for?licenceFor=&email=&error=&phone-number=')

    } else {

      if (newTerms) {

        // finish up, skip terms
        res.redirect('gafl-multibuy/payment-details')

      } else {

        // finish up, show terms
        res.redirect('gafl-multibuy/licence-conditions')

      }

    }

  } else {
    // nothing selected
    res.redirect('gafl-multibuy/add-another-licence?error=1')
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

router.post('/licenceFor', function (req, res) {

  // Make a variable from session data
  let source = req.session.data['source']
  let licenceFor = req.session.data['licenceFor']
  let lastLicenceFor = req.session.data['lastLicenceFor']


  if (licenceFor) {

    // if I have just started
    if (source === 'gafl') {
      // new licence, ask all the questions
      res.redirect('gafl-multibuy/name?error=')

    // multi-buy
    } else {

      // work out if we need to skip the details that already exists

      // if the licence is for the named Angler (another person)
      // skip questions and set angler to 'same'

      if (licenceFor == 'same-other') {

        // reset source to gafl incase it was changed last round
        // licence is for another person, the same angler as last time
        // skips the name question
        // sets angler to same
        res.redirect('gafl-multibuy/start-kind?source=gafl&angler=same&error=&licenceFor=other')

      // if the licence is for a new 'other' (not named)

      } else if (licenceFor == 'other') {

        // reset source to gafl
        // licence is for the new angler, other person
        // ask all the questions
        // sets angler to same
        res.redirect('gafl-multibuy/name?source=gafl&angler=new&error=&licenceFor=other')

      } else {

        // if the licence is for You
        // and the last one was for You
        // licence for user
        // skip questions
        // angler = same

        // licence is for 'user'
        // has the user entered information about you before?
        if (lastLicenceFor == 'you') {

          // YES

          // licence is for the same angler, the user
          // reset source to gafl
          res.redirect('gafl-multibuy/start-kind?source=gafl&angler=same&error=&licenceFor=user')

        } else {

          // NO

          // licence is for You, the last round wasn't
          res.redirect('gafl-multibuy/name?source=gafl&angler=new&error=&licenceFor=user')

        }
      }
    } // if source is gafl / else multibuy

  } else { // is licenceFor true?

    res.redirect('gafl-multibuy/who-is-this-licence-for?error=1')
  }
})


// hacktime

// var a = {
//   fname: "Jon",
//   lname: "Smith",
//   age: 50
// }
// var b = a



// Renew routes
/////////////////////////////////////////////////////////////

// additional routing for renew
router.post('/renew-check-licence-option', function (req, res) {
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect('renew/licence-by?licenceBy=&confirmation=&email=sam.fisher@email.com&phone=')
  } else {
    res.redirect('renew/licence-confirmation?licenceBy=&confirmation=&email=sam.fisher@email.com&phone=')
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
