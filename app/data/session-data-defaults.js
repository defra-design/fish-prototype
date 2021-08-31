/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {

  // "fullName": "Sam Baiter",
  // "licenceType": "Trout and course",
  // "rods": "2",
  // "licenceLength": "12 month",
  // "address1": "15 Ward Road",
  // "address2": "",
  // "city": "Bath",
  // "postcode": "BA1 5EH",
  // "notificationPreference": "Email",
  // "emailAddress": "sam.baiter59@gmail.com",
  // "endDay": "10",
  // "endMonth": "April",
  // "endYear": "2020",
  // "startDay": "11",
  // "startMonth": "April",
  // "startYear": "2020",
  // "startDate": "11 April 2020"

  // Licence object stubb
  "times": [
    "9:12am",
    "9:17am",
    "9:21am",
    "9:22am",
    "9:29am"
  ],
  "endtimes": [
    "9:11am",
    "9:16am",
    "9:20am",
    "9:21am",
    "9:28am"
  ],
  "licenceNumbers": [
    "09120722-2WS2FSF-AJ2H17",
    "09120722-2WS2FJF-3JJS32",
    "09120722-2WF2FSM-P32H74",
    "09120722-2WF3FBD-HJ8721",
    "09120722-2WJ2FSA-YT1S22"
  ],
  "licenceList": [
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Licence 4",
    "Licence 5"
  ],
  "identificationNumbers": [
    "09197401276611",
    "09197401276611",
    "98198012118972",
    "01199912316810",
    "38000012256662"
  ],
  "concession": ["None"],
  "allLicences": []
}
