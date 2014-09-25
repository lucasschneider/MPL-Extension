(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/
  var addr = document.getElementById('address'),
    city = document.getElementById('city'),
    zip = document.getElementById('zipcode'),
    notice = document.createElement('div'),
    result = document.createElement('div');
  notice.id = 'tractNotice';
  notice.setAttribute('style', 'margin-top:.2em;margin-left:118px;font-style:italic;color:#c00;');
  result.setAttribute('id', 'tractResult');

  function cleanAddr(addr) {
    var i, addrParts, addrTrim;
    if (addr !== null) {
      addrParts = addr.value.split(" ");
    }
    addrTrim = '';
    for (i = 0; i < addrParts.length; i++) {
      if (i === 0) {
        addrTrim += encodeURIComponent(addrParts[i]);
      } else {
        addrTrim += "+" + encodeURIComponent(addrParts[i]);
      }
    }
    return addrTrim;
  }

  function pullCity(city) {
    console.log(city);
    var cty = '', ctyArr, i;
    if (city !== null) {
      ctyArr = city.replace(/[^a-zA-Z 0-9]+/g, '').toLowerCase().split(' ');
      for (i = 0; i < ctyArr.length - 1; i++) {
        if (i === 0) {
          cty += ctyArr[i];
        } else {
          cty += " " + ctyArr[i];
        }
      }
    }
    console.log(cty);
    return cty;
  }

// COPIED FROM collegeExp.js
  function fillDormExp() {
    var addr = document.getElementById('address'),
      addr2 = document.getElementById('address2'),
      zip = document.getElementById('zipcode'),
      expiry = document.getElementById('dateexpiry'),
      addrRegEx = /[ ]*15(10|20) tripp.*|[ ]*970 university.*|[ ]*(625|635|640|650) elm.*|[ ]*(35|420).{0,7}park.*|[ ]*1200 observatory.*|[ ]*16(35|50) kronshage.*|[ ]*(835|917|919|921).{0,6}dayton.*|[ ]*1950 willow.*|[ ]*(615|821|917).{0,6}johnson.*|[ ]*625 babcock.*/i,
      zipRegEx = /53706(\-[0-9]{4})?|53715(\-[0-9]{4})?/,
      addressVal,
      date,
      year;

    if (zip !== null && addr !== null && expiry.value === '') {
      addressVal = addr2 !== null ? addr.value + " " + addr2.value : addr.value;
      if (zipRegEx.test(zip.value) && addrRegEx.test(addressVal)) {
        date = new Date();
        switch (parseInt(date.getUTCMonth(), 10)) {
        case 0:
        case 1:
        case 2:
        case 3:
          year = date.getUTCFullYear();
          break;
        case 4:
          if (parseInt(date.getUTCDate(), 10) < 15) {
            year = date.getUTCFullYear();
          }
          break;
        default:
          year = (parseInt(date.getUTCFullYear(), 10) + 1).toString();
          break;
        }
        expiry.value = "05/15/" + year;
      }
    }
  }

  function selectUND(selectList) {
    var i;
    if (selectList !== null) {
      for (i = 0; i < selectList.length; i++) {
        if (selectList.children[i].value === "X-UND") {
          selectList.selectedIndex = i;
          break;
        }
      }
    }
  }

  function selectPSTAT(selectList, value, result, matchAddr) {
    var selected = false,
      i;
    if (selectList !== null && value !== null && result !== null && matchAddr !== null) {
      for (i = 0; i < selectList.length; i++) {
        if (selectList.children[i].value === value) {
          selectList.selectedIndex = i;
          selected = true;
          if (result !== null) {
            result.setAttribute('style', 'display:inline-block;color:#00c000;');
            result.textContent = '[MATCH: ' + matchAddr + ']';
          }
          break;
        }
      }
      if (!selected) {
        selectUND(selectList);
      }
    }
  }

  function selectMID(selectList, result, matchAddr) {
    if (selectList !== null && result !== null && matchAddr !== null) {
      if (/.*a(spen|urora).*|.*b(lackhawk|lackwood).*|(18|19)[0-9]{2} bristol.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C1", result, matchAddr);
      } else if (/.*b(oundary|riarcliff).*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C2", result, matchAddr);
      } else if (/.*anderson.*|.*b(eechwood|oulder).*|^[0-9]*[02468]$ branch.*|2[0-9]{3} bristol.*|.*mayflower.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C3", result, matchAddr);
      } else if (/.*a(dler|llen|mherst).*|^[0-9]*[13579]$ branch.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C4", result, matchAddr);
      } else if (/.*airport.*|.*alpha.|.*b(auer|elle fontaine|lack opal|ravo).*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C5", result, matchAddr);
      } else if (/.*a(l(do leopold|gonquin)|pprentice|ssociates).*|.*black cherry.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C6", result, matchAddr);
      } else if (/.*a(nna|ster).*|.*baskerville.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C7", result, matchAddr);
      } else if (/.*brindisi.*/i.test(matchAddr)) {
        selectPSTAT(selectList, "D-MID-C8", result, matchAddr);
      } else {
        selectUND(selectList);
      }
    }
  }

  function queryCensusTract() {
    var addr = document.getElementById('address'),
      city = document.getElementById('city'), //City state field
      entryForm = document.forms.entryform,
      selectList = (entryForm !== null) ? entryForm.elements.sort1 : null,
      notice = document.getElementById('tractNotice');

    if (addr.value !== "" && city.value !== "" && zip !== null && selectList !== null) {
      // Generate loading message
      notice.textContent = "Searching for census tract and zipcode... ";
      notice.appendChild(result);
      result.textContent = '';
      setTimeout(function () {
        if (result !== null && result.textContent === '') {
          result.setAttribute('style', 'display:inline-block');
          result.textContent = '[NOTE: Server slow to respond—please enter zipcode and census tract manually]';
        }
      }, 7000);

      console.log(cleanAddr(addr) + " :: " + pullCity(city.value));
      self.port.emit("queryCntySub", [cleanAddr(addr), pullCity(city.value)]);
      self.port.on("receivedCntySub", function (cntySub) {
        console.log('received cnty sub: ' + cntySub);
        window.cntySub = cntySub;
        self.port.emit("queryTract", [cleanAddr(addr), pullCity(city.value)]);
      });

      self.port.on("receivedTract", function (addrTract) { // addrTract[0] = matchedAddress; addrTract[1] = matchedZip
                                                           // addrTract[2] = censusTract
        console.log('received tract: ' + addrTract);
        if (addrTract !== null && addrTract.length === 3) {
          var matchAddr = addrTract[0];
          zip.value = addrTract[1];
          fillDormExp();
          switch (window.cntySub) {
          case "Blooming Grove town":
            selectPSTAT(selectList, "D-BG-T", result, matchAddr);
            break;
          case "Madison city":
            selectPSTAT(selectList, "D-" + addrTract[2], result, matchAddr);
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
            result.setAttribute('style', 'display:inline-block');
            result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
            break;
          }
        } else {
          selectUND(selectList);
          result.setAttribute('style', 'display:inline-block');
          result.textContent = "[FAILED: unable to determine county subdivision; please enter zipcode and PSTAT manually.]";
        }
      });
    }
  }

  if (addr !== null) {
    addr.addEventListener('blur', queryCensusTract);
    addr.parentElement.appendChild(notice);
  }
  if (city !== null) {
    city.addEventListener('blur', function () {pullCity(this.value); queryCensusTract(); });
  }
  }()); //end use strict