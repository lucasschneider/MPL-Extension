var zip = document.getElementById('zipcode');

if (zip != null) zip.onblur = function() {
  regEx = /53706.*/;
  if (regEx.test(zip.value)) {
    date = new Date();
    switch(parseInt(date.getUTCMonth())) {
    case 0:
    case 1:
    case 2:
    case 3:
      year = date.getUTCFullYear();
      break;
    case 4:
      if (parseInt(date.getUTCDate()) < 15)
        year = date.getUTCFullYear();
      break;
    default:
      year = (parseInt(date.getUTCFullYear())+1).toString();
    }
    document.getElementById('dateexpiry').value = "05/15/" + year;
  }
}
