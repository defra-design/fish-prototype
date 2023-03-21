//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here


// GAFL routes
/// //////////////////////////////////////////////////////////

const getPrototypeToUse = request => {
  const referrer = new URL(request.headers.referer)
  const [prototypeToUse] = /\/.*\//.exec(referrer.pathname)
  const strippedSlashes = prototypeToUse.replace(/\//g, '')
  return strippedSlashes
}

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
/// //////////////////////////////////////////////////////////

// bobo-multibuy
// buying on behalf of variation in the H1s
// more generic body content (in preparation for our bilingual work)

// ‘Who is the licence for?’ logic
//
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
// check name












// Routing for ‘Who is the licence for?’ radio options
router.post('/licenceHolder', function (req, res) {
  // Make a variable from session data
  let source = req.session.data['source']
  let licenceFor = req.session.data['licenceFor']
  let lastLicenceFor = req.session.data['lastLicenceFor']
  const prototypeToUse = getPrototypeToUse(req)

  if (licenceFor) {
    // if I have just started
    if (source === 'gafl') {
      // new licence, ask all the questions
      res.redirect(`/${prototypeToUse}/name?error=`)

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
        res.redirect(`/${prototypeToUse}/start-kind?source=gafl&angler=same&error=&licenceFor=other`)

        // if the licence is for a new 'other' (not named)
      } else if (licenceFor == 'other') {
        // reset source to gafl
        // licence is for the new angler, other person
        // ask all the questions
        // sets angler to same
        res.redirect(`/${prototypeToUse}/name?source=gafl&angler=new&error=&licenceFor=other`)
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
          res.redirect(`/${prototypeToUse}/start-kind?source=gafl&angler=same&error=&licenceFor=user`)
        } else {
          // NO

          // licence is for You, the last round wasn't
          res.redirect(`/${prototypeToUse}/name?source=gafl&angler=new&error=&licenceFor=user`)
        }
      }
    } // if source is gafl / else multibuy
  } else { // is licenceFor true?
    res.redirect(`/${prototypeToUse}/who-is-this-licence-for?error=1`)
  }
})






router.post('/nameCheck', function (req, res) {
  // Make a variable from session data
  let firstName = req.session.data['firstName']
  let lastName = req.session.data['last-name']
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!firstName && lastName) {
    res.redirect(`/${prototypeToUse}/name?errorcode=10`)
  }
  else if (firstName && !lastName) {
    res.redirect(`/${prototypeToUse}/name?errorcode=20`)
  }
  else if (!firstName && !lastName) {
    res.redirect(`/${prototypeToUse}/name?errorcode=30`)
  }
  else if (firstName.length < 2) {
    res.redirect(`/${prototypeToUse}/name?errorcode=15`)
  }
  else if (lastName.length < 2) {
    res.redirect(`/${prototypeToUse}/name?errorcode=25`)
  }
  else if (firstName.length < 2 && lastName.length < 2) {
    res.redirect(`/${prototypeToUse}/name?errorcode=25`)
  }
   else {
    res.redirect(`/${prototypeToUse}/date-of-birth`)
  }

})






router.post('/dateOfBirth', function (req, res) {
  // Make a variable from session data
  let dobDay = req.session.data['dob_day']
  let dobMonth = req.session.data['dob_month']
  let dobYear = req.session.data['dob_year']
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!dobDay || !dobMonth || !dobYear) {
    res.redirect(`/${prototypeToUse}/date-of-birth?errorcode=10`)
  }
  else {
    res.redirect(`/${prototypeToUse}/disability-concession`)
  }

})






router.post('/dConcession', function (req, res) {
  // Make a variable from session data
  let concType = req.session.data['concession']
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (concType == 'None') {
    res.redirect(`/${prototypeToUse}/disability-concession?errorcode=5`)
  }
  else {
    res.redirect(`/${prototypeToUse}/start-kind?concession=${concType}`)
  }

})




router.post('/licenceStart', function (req, res) {
  // Make a variable from session data
  let licenceStart = req.session.data['licence-start']
  let licenceStartDay = req.session.data['licence-start-date-day'];
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!licenceStart) {
    res.redirect(`/${prototypeToUse}/start-kind?errorcode=11`)
  }
  else {
    res.redirect(`/${prototypeToUse}/licence-type`)
  }

})






router.post('/multibuy-check-licence-type', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)

  let licenceType = req.session.data['licence-type']

  if (!licenceType) {
    res.redirect(`/${prototypeToUse}/licence-type?errorcode=12`)
  } else if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect(`/${prototypeToUse}/licence-summary`)
  } else if (licenceType === 'Salmon and sea trout') {
    res.redirect(`/${prototypeToUse}/licence-length?rcr=true`)
  } else {
    res.redirect(`/${prototypeToUse}/licence-length`)
  }


})





router.post('/licenceLength', function (req, res) {
  // Make a variable from session data
  let licenceLength = req.session.data['licence-length']
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!licenceLength) {
    res.redirect(`/${prototypeToUse}/licence-length?errorcode=14`)
  }
  else {
    res.redirect(`/${prototypeToUse}/licence-summary`)
  }

})


router.post('/licenceLength', function (req, res) {
  // Make a variable from session data
  let licenceLength = req.session.data['licence-length']
  let errorCode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!licenceLength) {
    res.redirect(`/${prototypeToUse}/licence-length?errorcode=14`)
  }
  else {
    res.redirect(`/${prototypeToUse}/licence-summary`)
  }

})




router.post('/findAddress', function (req, res) {
  // Make a variable from session data
  let buildingNumber = req.session.data['building-number']
  let postCode = req.session.data['postcode']
  let findaddresserror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!buildingNumber && postCode) {
    res.redirect(`/${prototypeToUse}/find-address?findaddresserror=10`)
  }
  else if (buildingNumber && !postCode) {
    res.redirect(`/${prototypeToUse}/find-address?findaddresserror=20`)
  }
  else if (!buildingNumber && !postCode) {
    res.redirect(`/${prototypeToUse}/find-address?findaddresserror=30`)
  }
  else {
    res.redirect(`/${prototypeToUse}/select-address`)
  }

})




router.post('/enterAddress', function (req, res) {
  // Make a variable from session data
  let buildingNumber = req.session.data['building-number']
  let town = req.session.data['town']
  let postCode = req.session.data['postcode']
  let enteraddresserror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!buildingNumber || !town || !postCode) {
    res.redirect(`/${prototypeToUse}/address?enteraddresserror=10`)
  }
  else {
    res.redirect(`/${prototypeToUse}/licence-option`)
  }

})




// routing for the paperless question screen
router.post('/multibuy-check-licence-option', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect(`/${prototypeToUse}/licence-by`)
  } else {
    res.redirect(`/${prototypeToUse}/licence-confirmation`)
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
  }

  // add the data to an object called licences
  allLicences.push(lastLicenceData)

  // increment licence numbers
  if (licences === 1) {
    req.session.data.licences = 2
  } else if (licences === 2) {
    req.session.data.licences = 3
  } else if (licences === 3) {
    req.session.data.licences = 4
  } else if (licences > 3) {
    req.session.data.licences = 5 // hardcoded max of 5
  } else {
    req.session.data.licences = 1
  }

  // go to the screen that asks if you want another licence
  res.redirect(`/${getPrototypeToUse(req)}/add-another-licence`)
})

// check to route someone who wants to buy other licence
router.post('/multibuy-add-licences', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
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

      req.session.data.source = 'multibuy'
      // req.session.data.licenceFor = '';

      // rename variables and use server side changes

      // redirect, clears variables
      res.redirect(`/${prototypeToUse}/who-is-this-licence-for?licenceFor=&email=&error=&phone-number=`)
    } else {
      if (newTerms) {
        // finish up, skip terms
        res.redirect(`/${prototypeToUse}/licence-conditions-notice`)
      } else {
        // finish up, show terms
        res.redirect(`/${prototypeToUse}/licence-terms`)
      }
    }
  } else {
    // nothing selected
    res.redirect(`/${prototypeToUse}/add-another-licence?error=1`)
  }
})

// bobo-multibuy-2021-12
/// //////////////////////////////////////////////////////////

// more variation for buying on behalf of content

router.post('/licenceFor', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let source = req.session.data['source']
  let licenceFor = req.session.data['licenceFor']
  let lastLicenceFor = req.session.data['lastLicenceFor']

  if (licenceFor) {
    // if I have just started
    if (source === 'gafl') {
      // new licence, ask all the questions
      res.redirect(`/${prototypeToUse}/name?error=`)

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
        res.redirect(`/${prototypeToUse}/start-kind?source=gafl&angler=same&error=&licenceFor=other`)

        // if the licence is for a new 'other' (not named)
      } else if (licenceFor == 'other') {
        // reset source to gafl
        // licence is for the new angler, other person
        // ask all the questions
        // sets angler to same
        res.redirect(`/${prototypeToUse}/name?source=gafl&angler=new&error=&licenceFor=other`)
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
          res.redirect(`/${prototypeToUse}/start-kind?source=gafl&angler=same&error=&licenceFor=user`)
        } else {
          // NO

          // licence is for You, the last round wasn't
          res.redirect(`/${prototypeToUse}/name?source=gafl&angler=new&error=&licenceFor=user`)
        }
      }
    } // if source is gafl / else multibuy
  } else { // is licenceFor true?
    res.redirect(`/${prototypeToUse}/who-is-this-licence-for?error=1`)
  }
})

// route for the licence type radio options
//
router.post('/multibuy-check-licence-type-21-12', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let licenceType = req.session.data['licence-type']
  // route depending on value
  // i am not sure why we have this…
  if (licenceType === 'Trout and coarse, up to 3 rods') {
    res.redirect(`/${prototypeToUse}/licence-summary`)
  } else if (licenceType === 'Salmon and sea trout') {
    res.redirect(`/${prototypeToUse}/licence-length?rcr=true`)
  } else {
    res.redirect(`/${prototypeToUse}/licence-length`)
  }
})

router.post('/multibuy-check-licence-option-21-12', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    // res.redirect('gafl/add-email')
    res.redirect(`/${prototypeToUse}/licence-by`)
  } else {
    res.redirect(`/${prototypeToUse}/licence-confirmation`)
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
  }

  // add the data to an object called licences
  allLicences.push(lastLicenceData)

  // increment licence numbers
  if (licences === 1) {
    req.session.data.licences = 2
  } else if (licences === 2) {
    req.session.data.licences = 3
  } else if (licences === 3) {
    req.session.data.licences = 4
  } else if (licences > 3) {
    req.session.data.licences = 5 // hardcoded max of 5
  } else {
    req.session.data.licences = 1
  }

  // go to the screen that asks if you want another licence
  res.redirect(`/${getPrototypeToUse(req)}/add-another-licence`)
})

// check to route someone who wants to buy other licence
router.post('/multibuy-add-licences', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
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

      req.session.data.source = 'multibuy'
      // req.session.data.licenceFor = '';

      // rename variables and use server side changes

      // redirect, clears variables
      res.redirect(`/${prototypeToUse}/who-is-this-licence-for?licenceFor=&email=&error=&phone-number=`)
    } else {
      if (newTerms) {
        // finish up, skip terms
        res.redirect(`/${prototypeToUse}/licence-conditions-notice`)
      } else {
        // finish up, show terms
        res.redirect(`/${prototypeToUse}/licence-terms`)
      }
    }
  } else {
    // nothing selected
    res.redirect(`/${prototypeToUse}/add-another-licence?error=1`)
  }
})

// Renew routes
/// //////////////////////////////////////////////////////////

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
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  // route depending on value
  if (licenceOption === 'digital') {
    res.redirect(`${prototypeToUse}/change-licence-by`)
  } else {
    res.redirect(`${prototypeToUse}/contact-summary`)
  }
})

router.post('/service-start-routing', function (req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let serviceOption = req.session.data['option']
  // route depending on value
  if (serviceOption === 'new') {
    res.redirect(`${prototypeToUse}/date-of-birth`)
  } else {
    res.redirect('renew/check-licence-holder')
  }
})




router.post('/gafl-recurring-payments/payment-options-form', function (req, res) {
  // const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let paymentOption = req.session.data['payment-options-radio']
  // route depending on value
  if (paymentOption === 'single-payment') {
    res.redirect('payment-details')
  } else {
    res.redirect('rp-terms')
  }
})
