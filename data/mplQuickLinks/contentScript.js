var opacNote = document.getElementById('opacnote'),
  categoryCode = document.getElementsByClassName('categorycode'),
 startingBalance,
 date,
 month,
 day,
 incrementYear = false,
 year,
 expiryDate = '';
if (opacNote !== null) {
  startingBalance = prompt('What is the patron\'s starting balance for this payment plan?');
  if (startingBalance !== null && startingBalance !== '') {
    date = new Date();
    month = date.getUTCMonth();
    month += 7;
    if (month > 12) {
      month -= 12;
      incrementYear = true;
    }
    if (month < 10) {
      month = '0' + month;
    }
    day = date.getUTCDate();
    if (day < 10) {
      day = '0' + day;
    }
    year = incrementYear ? date.getUTCFullYear() + 1 : date.getUTCFullYear();
    expiryDate += month + '/' + day + '/' + year;
    if (opacNote.value !== null && opacNote.value !== '') {
      opacNote.value += "\n\n";
    }
    opacNote.value += 'AT MADISON PUBLIC LIBRARY ONLY, patron is allowed to checkout if they pay $1.00 per item. FULL payment is required outside of MPL. NO Outerloan or Rental checkouts allowed while on the plan. Holds are allowed only as copy specific on MPL items. Plan is void if new fees are added. Patron’s account is limited use while they are on the plan. Starting balance was $' + startingBalance + '. Charges must be paid by ' + expiryDate + '. ';
    if (categoryCode !== null && categoryCode[0].value === 'AD') {
      categoryCode[0].value = 'LU';
    } else if (categoryCode !== null && categoryCode[0].value == 'JU') {
      categoryCode[0].value = 'LUJ';
    }
  } else {
    alert('Payment plan note was not added.');
  }
} else {
  alert('A payment plan note cannot be added unless you are currently editing a patron record.');
}
