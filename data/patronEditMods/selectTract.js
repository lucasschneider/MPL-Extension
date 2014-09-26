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
      addrParts = addr.value.toLowerCase().split(" ");
    }
    addrTrim = '';
    for (i = 0; i < addrParts.length-1; i++) {
      switch (addrParts[i]) {
      case "n":
        addrParts[i] = "north";
        break;
      case "e":
        addrParts[i] = "east";
        break;
      case "s":
        addrParts[i] = "south";
        break;
      case "w":
        addrParts[i] = "west";
        break;
      default:
        break;
      }
      if (i === 0) {
        addrTrim += encodeURIComponent(addrParts[i]);
      } else {
        addrTrim += "+" + encodeURIComponent(addrParts[i]);
      }
    }
    return addrTrim;
  }

  function pullCity(city) {
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
    return cty;
  }

  function selectUND(selectList) {
    var addr = document.getElementById('address'),
      i;
    if (addr !== null && addr.value === '' && selectList !== null) {
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
          if (result !== null && value !== "D-X-SUN") {
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

      self.port.emit("queryCntySub", [cleanAddr(addr), pullCity(city.value)]);
      self.port.on("receivedCntySub", function (cntySub) {
        // cntySub[0] = cntySub; cntySub[1] = matchAddr;
        var matchAddr = cntySub[1];
        switch (cntySub[0]) {

        /*** FREQUENTLY USED PSTATS ***/
        case "Blooming Grove town":
          selectPSTAT(selectList, "D-BG-T", result, matchAddr);
          break;
        case "Fitchburg city":
          selectPSTAT(selectList, "D-FIT-T", result, matchAddr);
          break;
        case "Madison city":
          self.port.emit("queryTract", [cleanAddr(addr), pullCity(city.value)]);
          self.port.on("receivedTract", function (addrTract) {
            // addrTract[0] = matchedAddress; addrTract[1] = matchedZip
            // addrTract[2] = censusTract
            if (addrTract !== null && addrTract.length === 3) {
              var matchAddr = addrTract[0];
              zip.value = addrTract[1];
              selectPSTAT(selectList, "D-" + addrTract[2], result, matchAddr);
              // Defined in collegeExp.js
              window.fillDormExp();
            } else {
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter zipcode and PSTAT manually.]";
            }
          });
          break;
        case "Madison town":
          selectPSTAT(selectList, "D-MAD-T", result, matchAddr);
          break;
        case "Middleton town":
          selectPSTAT(selectList, "D-MID-T", result, matchAddr);
          break;
         /*** UNDETERMINABLE COUNTY SUBDIVISIONS ***/
        case "Sun Prairie city":
          selectPSTAT(selectList, "D-X-SUN", result, matchAddr);
          result.setAttribute('style', 'display:inline-block');
          result.textContent = "[FAILED: automatic generation only occurs for libraries that sort by census tract or county subdivision.]";
          break;
        case "Middleton city":
        case "Monona city":
        case "Verona city":
          selectUND(selectList);
          result.setAttribute('style', 'display:inline-block');
          result.textContent = "[FAILED: automatic generation only occurs for libraries that sort by census tract or county subdivision.]";
          break;
         /*** MAIN LIST ***/
        case "Adams city":
          selectPSTAT(selectList, "A-ADM-C", result, matchAddr);
          break;
        // For "Adams town" (Adams County) see DUPLICATE SUBDIVISION NAMES
        // For "Adams town" (Green County) see DUPLICATE SUBDIVISION NAMES
        case "Alban town":
          selectPSTAT(selectList, "P-ALB-T", result, matchAddr);
          break;
        case "Albany town":
          selectPSTAT(selectList, "G-ALB-T2", result, matchAddr);
          break;
        case "Albany village":
          selectPSTAT(selectList, "G-ALB-V", result, matchAddr);
          break;
        case "Albion town":
          selectPSTAT(selectList, "D-ALB-T", result, matchAddr);
          break;
        case "Almond town":
          selectPSTAT(selectList, "P-ALM-T", result, matchAddr);
          break;
        case "Almond village":
          selectPSTAT(selectList, "P-ALM-V", result, matchAddr);
          break;
        case "Amherst Junction village":
          selectPSTAT(selectList, "P-AMJ-V", result, matchAddr);
          break;
        case "Amherst town":
          selectPSTAT(selectList, "P-AMH-T", result, matchAddr);
          break;
        case "Amherst village":
          selectPSTAT(selectList, "P-AMH-V", result, matchAddr);
          break;
        // For "Arena town" see RECIPROCAL COUNTIES
        // For "Arena village" see RECIPROCAL COUNTIES
        case "Arlington town":
          selectPSTAT(selectList, "C-ARL-T", result, matchAddr);
          break;
        case "Arlington village":
          selectPSTAT(selectList, "C-ARL-V", result, matchAddr);
          break;
        case "Arpin town":
          selectPSTAT(selectList, "W-ARP-T", result, matchAddr);
          break;
        case "Arpin village":
          selectPSTAT(selectList, "W-ARP-V", result, matchAddr);
          break;
        // For "Ashippun town" see RECIPROCAL COUNTIES
        case "Auburndale town":
          selectPSTAT(selectList, "W-AUB-T", result, matchAddr);
          break;
        case "Auburndale village":
          selectPSTAT(selectList, "W-AUB-V", result, matchAddr);
          break;
        // For "Avoca village" see RECIPROCAL COUNTIES
        // For "Aztalan town" see RECIPROCAL COUNTIES
        case "Baraboo city":
          selectPSTAT(selectList, "S-BAR-C1", result, matchAddr);
          break;
        case "Baraboo town":
          selectPSTAT(selectList, "S-BAR-T", result, matchAddr);
          break;
        // For "Barneveld village" see RECIPROCAL COUNTIES
        case "Bear Creek town":
          selectPSTAT(selectList, "S-BC-T", result, matchAddr);
          break;
        // For "Beaver Dam city" see RECIPROCAL COUNTIES
        // For "Beaver Dam town" see RECIPROCAL COUNTIES
        // For "Belleville village" (DANE COUNTY) see DUPLICATE SUBDIVISION NAMES
        // For "Belleville village" (GREEN COUNTY) see DUPLICATE SUBDIVISION NAMES
        case "Belmont town":
          selectPSTAT(selectList, "P-BEL-T", result, matchAddr);
          break;
        // For "Beloit city" see RECIPROCAL COUNTIES
        // For "Berlin city" see RECIPROCAL COUNTIES
        case "Berry town":
          selectPSTAT(selectList, "D-BERR-T", result, matchAddr);
          break;
        case "Big Flats town":
          selectPSTAT(selectList, "D-BIG-T", result, matchAddr);
          break;
        case "Biron village":
          selectPSTAT(selectList, "W-BIR-V", result, matchAddr);
          break;
        case "Black Earth town":
          selectPSTAT(selectList, "D-BE-T", result, matchAddr);
          break;
        case "Black Earth village":
          selectPSTAT(selectList, "B-BE-V", result, matchAddr);
          break;
        // For "Blanchardville village" see RECIPROCAL COUNTIES
        // For "Blooming Grove town" see FREQUENTLY USED PSTATS
        case "Blue Mounds town":
          selectPSTAT(selectList, "D-BM-T", result, matchAddr);
          break;
        case "Blue Mounds village":
          selectPSTAT(selectList, "D-BM-V", result, matchAddr);
          break;
        // For "Brigham town" see RECIPROCAL COUNTIES
        case "Bristol town":
          selectPSTAT(selectList, "D-BRI-T", result, matchAddr);
          break;
        // For "Brodhead city" (Green County) see DUPLICATE SUBDIVISION NAMES
        // For "Brodhead city" (Rock County) see DUPlICATE SUBDIVISION NAMES
        case "Brooklyn town":
          selectPSTAT(selectList, "G-BRO-T", result, matchAddr);
          break;
        // For "Brooklyn village" (Dane County) see DUPLICATE SUBDIVISION NAMES
        // For "Brooklyn village" (Green County) see DUPLICATE SUBDIVISION NAMES
        // For "Brownsville village" see RECIPROCAL COUNTIES
        // For "Fitchburg city" see FREQUENTLY USED PSTATS
        // For "Madison city" see FREQUENTLY USED PSTATS
        // For "Madison town" see FREQUENTLY USED PSTATS
        // For "Middleton city" see UNDETERMINABLE COUNTY SUBDIVISIONS
        // For "Middleton town" see FREQUENTLY USED PSTATS
        // For "Monona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
        // For "Sun Prairie city" see UNDETERMINABLE COUNTY SUBDIVISIONS
        // For "Verona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
        /*** RECIPROCAL COUNTIES ***/
        case "Arena town": // IOWA COUNTY
          selectPSTAT(selectList, "O-SWLS-ART", result, matchAddr);
          break;
        case "Arena village": // IOWA COUNTY
          selectPSTAT(selectList, "O-SWLS-ARV", result, matchAddr);
          break;
        case "Ashippun town": // DODGE COUNTY
          selectPSTAT(selectList, "O-MWFLS", result, matchAddr);
          break;
        case "Avoca village": // IOWA COUNTY
          selectPSTAT(selectList, "O-SWLS-AVV", result, matchAddr);
          break;
        case "Aztalan town": // JEFFERSON COUNTY
          selectPSTAT(selectList, "O-MWFLS-AZT", result, matchAddr);
          break;
        case "Barneveld village": // IOWA COUNTY
          selectPSTAT(selectList, "O-SWLS-BAV", result, matchAddr);
          break;
        case "Beaver Dam city": // DODGE COUNTY
          selectPSTAT(selectList, "O-MWFLS-BVC", result, matchAddr);
          break;
        case "Beaver Dam town": // DODGE COUNTY
          selectPSTAT(selectList, "O-MWFLS-BVT", result, matchAddr);
          break;
        case "Beloit city": // ROCK COUNTY
          selectPSTAT(selectList, "O-ALS-BEL-C", result, matchAddr);
          break;
        case "Berlin city": // GREEN LAKE COUNTY
          selectPSTAT(selectList, "O-WLS-BLC", result, matchAddr);
          break;
        case "Blanchardville village":
          selectPSTAT(selectList, "O-SWLS-BLA", result, matchAddr);
          break;
        case "Brigham town": // IOWA COUNTY
          selectPSTAT(selectList, "", result, matchAddr);
          break;
        /*** DUPLICATE SUBDIVISION NAMES AND DEFAULT ***/
        default:
          selectUND(selectList);
          result.setAttribute('style', 'display:inline-block');
          result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
          break;
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
