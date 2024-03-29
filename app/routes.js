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




router.post('/selectAddress', function (req, res) {
  // Make a variable from session data
  let foundAddress = req.session.data['found-address']
  let junior = req.session.data['junior']
  let licenceLength = req.session.data['licence-length']
  let foundaddresserror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!foundAddress) {
    res.redirect(`/${prototypeToUse}/select-address?foundaddresserror=1`)
  }
  else {
    if (junior) {
      res.redirect(`/${prototypeToUse}/licence-by`)
    }
    else {
      if (licenceLength == '12 month') {
        res.redirect(`/${prototypeToUse}/licence-option`)
      } else {
        res.redirect(`/${prototypeToUse}/licence-by`)
      }
    }
    // {% if data['junior'] %}
    //   <form action="licence-by">
    // {% else %}
    //   {% if data['licence-length'] == "12 month" %}
    //     <form action="licence-option">
    //   {% else %}
    //     <form action="licence-by">
    //   {% endif %}
    // {% endif %}
  } // end of big else
})


router.post('/licenceBy', function(req, res) {
  // Make a variable from session data
  let licenceBy = req.session.data['licenceBy']
  let licenceFor = req.session.data['licenceFor']
  let junior = req.session.data['junior']
  let licencebyerrorcode = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!licenceBy) {
    res.redirect(`/${prototypeToUse}/licence-by?licencebyerrorcode=2`)
  } else {

    if (junior) {
      if (licenceFor == 'user') {
        res.redirect(`/${prototypeToUse}/newsletter`)
      } else {
        res.redirect(`/${prototypeToUse}/contact-summary`)
      }
    } else {
      if (licenceBy == 'email') {
        res.redirect(`/${prototypeToUse}/email-address-correct`)
      } else {
        res.redirect(`/${prototypeToUse}/phone-number-correct`)
      }
    }
  }
})



router.post('/licenceConfirmation', function (req, res) {
  // Make a variable from session data
  let licenceConf = req.session.data['licence-confirmation']
  let licenceconferror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!licenceConf) {
    res.redirect(`/${prototypeToUse}/licence-confirmation?licenceconferror=1`)
  }
  else {
    if (licenceConf == 'email') {
      res.redirect(`/${prototypeToUse}/email-address-correct`)
    }
    else if (licenceConf == 'phone') {
      res.redirect(`/${prototypeToUse}/phone-number-correct`)
    }
    else {
      res.redirect(`/${prototypeToUse}/contact-preference`)
    }


  }

})




router.post('/contactPrefs', function (req, res) {
  // Make a variable from session data
  let contactPref = req.session.data['contact']
  let licenceFor = req.session.data['licenceFor']
  let contactpreferror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!contactPref) {
    res.redirect(`/${prototypeToUse}/contact-preference?contactpreferror=1`)
  }
  else {
    if (licenceFor == 'user') {
      res.redirect(`/${prototypeToUse}/newsletter`)
    } else {
      res.redirect(`/${prototypeToUse}/contact-summary`)
    }

  }

  // {% if data['licenceFor'] == "user" %}
  //   <form action="newsletter">
  // {% else %}
  //   <form action="contact-summary">
  // {% endif %}

})




router.post('/licenceTerms', function (req, res) {
  // Make a variable from session data
  let agreeTerms = req.session.data['agree-terms']
  let agreetermserror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!agreeTerms) {
    res.redirect(`/${prototypeToUse}/licence-terms?agreetermserror=1`)
  }
  else {
    res.redirect(`/${prototypeToUse}/payment-details`)
  }

})



router.post('/licenceTermsRP', function (req, res) {
  // Make a variable from session data
  let agreeTerms = req.session.data['agree-terms']
  let agreetermserror = 0
  const prototypeToUse = getPrototypeToUse(req)

  if (!agreeTerms) {
    res.redirect(`/${prototypeToUse}/licence-terms?agreetermserror=1`)
  }
  else {
    res.redirect(`/${prototypeToUse}/payment-options`)
  }

})





// routing for IWTF-3998
router.post('/licenceTermsGafl', function (req, res) {
  let agreeTerms = req.session.data['agree-terms']
  let agreetermserror = 0
  const prototypeToUse = getPrototypeToUse(req)
  if (!agreeTerms) {
    res.redirect(`/${prototypeToUse}/licence-terms-gafl?agreetermserror=1`)
  }
  else {
    res.redirect(`/${prototypeToUse}/payment-options`)
  }
})
router.post('/licenceTermsBobo', function (req, res) {
  let agreeTerms = req.session.data['agree-terms']
  let agreetermserror = 0
  const prototypeToUse = getPrototypeToUse(req)
  if (!agreeTerms) {
    res.redirect(`/${prototypeToUse}/licence-terms-bobo?agreetermserror=1`)
  }
  else {
    res.redirect(`/${prototypeToUse}/payment-options`)
  }
})





// routing for the paperless question screen
router.post('/multibuy-check-licence-option', function(req, res) {
  const prototypeToUse = getPrototypeToUse(req)
  // Make a variable from session data
  let licenceOption = req.session.data['licence-option']
  let optionerrorcode = 0

  if (!licenceOption) {
    res.redirect(`/${prototypeToUse}/licence-option?optionerrorcode=1`)
  } else {
    // route depending on value
    if (licenceOption === 'digital') {
      // res.redirect('gafl/add-email')
      res.redirect(`/${prototypeToUse}/licence-by`)
    } else {
      res.redirect(`/${prototypeToUse}/licence-confirmation`)
    }
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



router.post('/payment-options-form', function (req, res) {
  let paymentOption = req.session.data['payment-options-radio']
  const prototypeToUse = getPrototypeToUse(req)

  if (!paymentOption) {
    res.redirect(`/${prototypeToUse}/payment-options?paymentoptionserror=1`)
  }

  else if (paymentOption === 'single-payment') {
    res.redirect(`${prototypeToUse}/payment-details`)
  } else {
    res.redirect(`${prototypeToUse}/rp-terms`)
  }
})



router.post('/paymentDetails', function (req, res) {
  let paymentOption = req.session.data['payment-options-radio']
  const prototypeToUse = getPrototypeToUse(req)

  if (paymentOption === 'single-payment') {
    res.redirect(`${prototypeToUse}/payment-confirmation`)
  } else {
    res.redirect(`${prototypeToUse}/payment-in-progress`)
  }
})



router.post('/erDetails', function (req, res) {
  // Make a variable from session data
  let sixChars = req.session.data['six-chars']
  let erDobDay = req.session.data['er-dob-day']
  let erPostCode = req.session.data['er-postcode']
  let erdetailserror = 0
  const prototypeToUse = getPrototypeToUse(req)

//  if (!sixChars || !town || !postCode) {
  if (!sixChars || !erPostCode || !erDobDay) {
    res.redirect(`/${prototypeToUse}/er-confirm-your-details?erdetailserror=10`)
  }
  else {
    res.redirect(`/${prototypeToUse}/er-check-licence-details`)
  }

})


router.post('/rcpDetails', function (req, res) {
  // Make a variable from session data
  let rcpSixChars = req.session.data['rcp-six-chars']
  let rcpDobDay = req.session.data['rcp-dob-day']
  let rcpPostCode = req.session.data['rcp-postcode']
  let rcpdetailserror = 0
  const prototypeToUse = getPrototypeToUse(req)

//  if (!sixChars || !town || !postCode) {
  if (!rcpSixChars || !rcpPostCode || !rcpDobDay) {
    res.redirect(`/${prototypeToUse}/rcp-cancel_enter-details?rcpdetailserror=10`)
  }
  else {
    res.redirect(`/${prototypeToUse}/rcp-cancel_confirm-details`)
  }

})


router.post('/rpTerms', function (req, res) {
  let termsAgreed = req.session.data['rp-terms']
  const prototypeToUse = getPrototypeToUse(req)
  let rptermserror = 0

  if (!termsAgreed) {
    res.redirect(`${prototypeToUse}/rp-terms?rptermserror=10`)
  } else {
    res.redirect(`${prototypeToUse}/payment-details`)
  }
})
