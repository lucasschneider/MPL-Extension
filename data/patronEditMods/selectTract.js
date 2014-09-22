addr = document.getElementById('address');
result = document.createElement('div');
result.setAttribute('id','tractResult');

if (addr !== null) {
  addr.addEventListener('blur', queryCensusTract);
  var notice = document.createElement('div');
  notice.id = 'tractNotice';
  notice.setAttribute('style','margin-top:.2em;margin-left:118px;font-style:italic;color:#c00;');
  addr.parentElement.appendChild(notice);
}
var city = document.getElementById('city');
if (city !== null) city.addEventListener('blur', queryCensusTract);

// COPIED FROM collegeExp.js
function fillDormExp() {
  addr = document.getElementById('address');
  var addr2 = document.getElementById('address2');
  var zip = document.getElementById('zipcode');
  var expiry = document.getElementById('dateexpiry');
  
  if (zip !== null && addr !== null && expiry.value === '') {
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
      expiry.value = "05/15/" + year;
    }
  }
}

function selectPSTAT(selectList, value, result, matchAddr) {
  if (selectList !== null && value !== null && result !== null && matchAddr !== null) {
    for (var i = 0; i < selectList.length; i++) {
      if (selectList.children[i].value === value) {
        selectList.selectedIndex = i;
        if (result !== null) {
          result.setAttribute('style','display:inline-block;color:#00c000;');
          result.textContent = '[MATCH: '+matchAddr+']';
        }
        break;
      }
    }
  }
}

function selectUND(selectList) {
  if (selectList !== null) {
    for (var i = 0; i < selectList.length; i++) {
      if (selectList.children[i].value === "X-UND") {
        selectList.selectedIndex = i;
        break;
      }
    }
  }
}

function cleanAddr(addr) {;
  if (addr !== null) addrParts = addr.value.split(" ");
  addrTrim = '';
  for (var i = 0; i < addrParts.length; i++) {
    if (i === 0) addrTrim += encodeURIComponent(addrParts[i]);
    else addrTrim += " " + encodeURIComponent(addrParts[i]);
  }
  return addrTrim;
}

function queryCensusTract() {
  addr = document.getElementById('address');
  var city = document.getElementById('city');
  var entryForm = document.forms.entryform;
  var selectList = (entryForm !== null) ? entryForm.elements.sort1 : null;
  var notice = document.getElementById('tractNotice');
  cntySub = null;
  addrTract = null;

  if (addr.value !== "" && city.value !== "" && zip !== null && selectList !== null) {
    // Generate loading message
    notice.textContent = "Searching for census tract and zipcode... ";
    notice.appendChild(result);
    result.textContent = '';
    setTimeout(function() {
      if (result !== null && result.textContent === '') {
        result.setAttribute('style','display:inline-block');
        result.textContent = '[NOTE: Server slow to respond—please enter zipcode and census tract manually]';
      }
    }, 6000);

    self.port.emit("queryCntySub", cleanAddr(addr));
    self.port.on("receivedCntySub", function (cntySubDiv) {
      cntySub = cntySubDiv;
      self.port.emit("queryTract", cleanAddr(addr));
    });
    self.port.on("receivedTract", function (addrTract) {
      var addrTract = addrTract;
      var results = false;
      if (addrTract !== null && addrTract.length === 3) {
        var matchAddr = addrTract[0];
        zip.value = addrTract[1];
        fillDormExp();
        switch (cntySub) {
          case "Blooming Grove town":
            selectPSTAT(selectList, "D-BG-T", result, matchAddr);
            break;
          case "Madison city":
            selectPSTAT(selectList, "D-"+addrTract[2], result, matchAddr);
            break;
          case "Madison town":
            selectPSTAT(selectList, "D-MAD-T", result, matchAddr);
            break;
          default:
            selectUND(selectList);
            result.setAttribute('style','display:inline-block');
            result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
            break;
        }
      }
      else {
        selectUND(selectList);
        result.setAttribute('style','display:inline-block');
        result.textContent = "[FAILED: unable to determine county subdivision; please enter zipcode and PSTAT manually.]";
      }
    });
  }
}
