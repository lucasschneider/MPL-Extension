/*** CHECK FOR COLLEGE DORM ADDRESSES
     AND SET EXP DATE IF NECESSARY ***/
function fillDormExp() {
  var addr = document.getElementById('address');
  var addr2 = document.getElementById('address2');
  var zip = document.getElementById('zipcode');
  
  if (zip !== null && addr !== null && zip.value === '') {
    addrRegEx = /[ ]*15(10|20) tripp.*|[ ]*970 university.*|[ ]*(625|635|640|650) elm.*|[ ]*(35|420).{0,7}park.*|[ ]*1200 observatory.*|[ ]*16(35|50) kronshage.*|[ ]*(835|917|919|921).{0,6}dayton.*|[ ]*1950 willow.*|[ ]*(615|821|917).{0,6}johnson.*|[ ]*625 babcock.*/i;
    zipRegEx = /53706(\-[0-9]{4})?|53715(\-[0-9]{4})?/;
    var addressVal = addr2 !== null ? addr.value + " " + addr2.value : addr.value;
    
    if (zipRegEx.test(zip.value) && addrRegEx.test(addressVal)) {
      date = new Date();
      switch(parseInt(date.getUTCMonth())) {
      case 0:
      case 1:
      case 2:
     case 3:
        year = date.getUTCFullYear();
        break;
      case 4:
        if (parseInt(date.getUTCDate()) < 15) {
          year = date.getUTCFullYear();
        }
        break;
      default:
        year = (parseInt(date.getUTCFullYear())+1).toString();
        break;
      }
      document.getElementById('dateexpiry').value = "05/15/" + year;
    }
  }
}

var addr = document.getElementById('address');
if (addr !== null) addr.addEventListener('blur', fillDormExp);
var city = document.getElementById('city');
if (city !== null) city.addEventListener('blur', fillDormExp);
var zip = document.getElementById('zipcode');
if (zip !== null) zip.addEventListener('blur', fillDormExp);
