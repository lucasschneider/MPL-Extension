addr = document.getElementById('address');
city = document.getElementById('city');
result = document.createElement('div');
result.setAttribute('id','tractResult');

if (addr !== null) {
  addr.addEventListener('blur', queryCensusTract);
  var notice = document.createElement('div');
  notice.id = 'tractNotice';
  notice.setAttribute('style','margin-top:.2em;margin-left:118px;font-style:italic;color:#c00;');
  addr.parentElement.appendChild(notice);
}
if (city !== null) city.addEventListener('blur', function() {pullCity(this.value); queryCensusTract();});

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
    var selected = false;
    for (var i = 0; i < selectList.length; i++) {
      if (selectList.children[i].value === value) {
        selectList.selectedIndex = i;
        selected = true;
        if (result !== null) {
          result.setAttribute('style','display:inline-block;color:#00c000;');
          result.textContent = '[MATCH: '+matchAddr+']';
        }
        break;
      }
    }
    if (!selected) selectUND(selectList);
  }
}

function selectMID(selectList, result, matchAddr) {
  if (selectList !== null && result !== null && matchAddr !== null) {
    if (/.*a(spen|urora).*|.*b(lackhawk|lackwood).*|(18|19)[0-9]{2} bristol.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C1", result, matchAddr);
    else if (/.*b(oundary|riarcliff).*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C2", result, matchAddr);
    else if (/.*anderson.*|.*b(eechwood|oulder).*|^[0-9]*[02468]$ branch.*|2[0-9]{3} bristol.*|.*mayflower.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C3", result, matchAddr);
    else if (/.*a(dler|llen|mherst).*|^[0-9]*[13579]$ branch.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C4", result, matchAddr);
    else if (/.*airport.*|.*alpha.|.*b(auer|elle fontaine|lack opal|ravo).*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C5", result, matchAddr);
    else if (/.*a(l(do leopold|gonquin)|pprentice|ssociates).*|.*black cherry.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C6", result, matchAddr);
    else if (/.*a(nna|ster).*|.*baskerville.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C7", result, matchAddr);
    else if (/.*brindisi.*/i.test(matchAddr)) selectPSTAT(selectList, "D-MID-C8", result, matchAddr);
    else selectUND(selectList);
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
    else addrTrim += "+" + encodeURIComponent(addrParts[i]);
  }
  return addrTrim;
}

function pullCity(city) {
  console.log(city);
  var cty = '';
  if (city !== '') {
    ctyArr = city.replace(/[^a-zA-Z 0-9]+/g,'').toLowerCase().split(' ');
    for (i = 0; i < cty.length-1; i++) {
      if (i === 0) cty += ctyArr[i];
      else cty += " "+ctyArr[i];
    }
  }
  console.log(cty);
  return cty;
}

function queryCensusTract() {
  addr = document.getElementById('address');
  var city = document.getElementById('city'); //City state field
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
    }, 7000);

    self.port.emit("queryCntySub", cleanAddr(addr),pullCity(city.value));
    self.port.on("receivedCntySub", function (cntySubDiv) {
      console.log('received: '+cntySubDiv);
      cntySub = cntySubDiv;
      self.port.emit("queryTract", cleanAddr(addr),pullCity(city.value));
    });
    self.port.on("receivedTract", function (addrTract) {
      console.log('received: '+addrTract);
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
          case "Middleton city":
            selectMID(selectList, result, matchAddr);
            break;
          case "Middleton town":
            selectPSTAT(selectList, "D-MID-T", result, matchAddr);
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
