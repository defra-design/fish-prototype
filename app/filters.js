const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

addFilter('toMonth', function(x) {
  months = ["January ", "February ", "March ", "April ", "May ", "June ", "July ", "August ", "September ", "October ", "November ", "December "];
  if (x > 0) {
    return months[x - 1]; // returns date as per month
  } else {
    return x;
  }
})
