(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/
  var addrElt = document.getElementById('address'),
    cityElt = document.getElementById('city'),
    notice = document.createElement('div'),
    result = document.createElement('span');
  notice.id = 'tractNotice';
  notice.setAttribute('style', 'margin-top:.2em;margin-left:118px;font-style:italic;color:#c00;');
  result.setAttribute('id', 'tractResult');

  function cleanAddr(addr) {
    var i, addrParts, addrTrim;
    if (addr !== null) {
      addrParts = addr.value.toLowerCase().split(" ");
    }
    addrTrim = '';
    for (i = 0; i < addrParts.length; i++) {
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
      } else if (i === addrParts.length - 1) {
        if (!/\#?[0-9]+/.test(addrParts[i])) {
          addrTrim += "+" + encodeURIComponent(addrParts[i]);
        }
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
    var addr = document.getElementById('address');
    if (addr !== null && selectList.children[selectList.selectedIndex].value === '' && selectList !== null) {
      selectList.value = "X-UND";
    }
  }

  function selectPSTAT(selectList, value, result, matchAddr) {
    if (selectList !== null && value !== null && result !== null && matchAddr !== null) {
      selectList.value = value;
      if (value !== "D-X-SUN") {
        result.setAttribute('style', 'display:inline-block;color:#00c000;');
        result.textContent = ' [MATCH: ' + matchAddr + ']';
      }
    }
  }

  function queryPSTAT(addr, city, queryB) {
    var entryForm = document.forms.entryform,
      selectList = (entryForm !== undefined && entryForm !== null) ? entryForm.elements.sort1 : null,
      notice = document.getElementById('tractNotice');

    if (addr.value !== "" && city.value !== "" && selectList !== null) {
      // Placement of results notifier
      addr.parentElement.appendChild(notice);

      // Generate loading message
      notice.textContent = "Searching for sort value and zipcode... ";
      result.textContent = '';
      notice.appendChild(result);
      setTimeout(function () {
        if (result !== null && result.textContent === '') {
          result.setAttribute('style', 'display:inline-block;color:#a5a500;');
          result.textContent = '[NOTE: Server slow to respond—please enter zipcode and sort field manually]';
        }
      }, 12000);

      self.port.emit("queryGeocoder", [cleanAddr(addr), pullCity(city.value)]);
      self.port.on("receivedGeocoderQuery", function (data) {
        if (data !== null) {
          // data[0] = matched address
          // data[1] = county
          // data[2] = county subdivision
          // data[3] = census tract
          // data[4] = zip code
          var matchAddr = data[0],
            zipElt = document.getElementById('zipcode'),
            zipEltB = document.getElementById('B_zipcode');

          // Set zip code
          if (queryB) {
            if (zipEltB !== null) {
              zipEltB.value = data[4];
            }
          } else {
            if (zipElt !== null) {
              zipElt.value = data[4];
            }
          }

          // Set sort value
          switch (data[1]) {
          /*** SCLS LIBRARIES ***/
          case "Adams":
          case "Columbia":
          case "Dane":
          case "Green":
          case "Portage":
          case "Sauk":
          case "Wood":
            switch (data[2]) {
            /*** FREQUENTLY USED PSTATS ***/
            case "Blooming Grove town":
              selectPSTAT(selectList, "D-BG-T", result, matchAddr);
              break;
            case "Cottage Grove town":
              selectPSTAT(selectList, "D-CG-T", result, matchAddr);
              break;
            case "Cottage Grove village":
              selectPSTAT(selectList, "D-CG-V", result, matchAddr);
              break;
            case "Fitchburg city":
              selectPSTAT(selectList, "D-FIT-T", result, matchAddr);
              break;
            case "Madison city":
              selectPSTAT(selectList, "D-" + data[3], result, matchAddr);
              // Defined in collegeExp.js
              window.fillDormExp();
              break;
            case "Madison town":
              selectPSTAT(selectList, "D-MAD-T", result, matchAddr);
              break;
            case "Middleton city":
              if (/.*(aspen c|aurora s|blackhawk r|blackhawk c|1(8(09|[1-9][0-9])|9[0-9]{2}) bristol s|cayuga s|cobblestone c|1(2[6-9][0-9]|[3-9][0-9]{2}) deming w|elderwood c|7([0-7][0-9]{2}|800) elmwood ave|foxridge c|greenway b|grosse point d|henry c|henry s|(1[2-7][0-9][02468]|1[4-7][0-9][13579]) n(orth)? high point r|hillcrest a|7([0-5][0-9]{2}|600) hubbard a|john q\.? hammons d|77[0-9]{2} kenyon d|market s|meadow c|1[7-9][0-9][02468] middleton s|1[7-9][0-9]{2} park s|(1[4-6][0-9][02468]|1[7-9][0-9]{2}) parmenter s|(1322|1[4-9][0-9]{2}) pleasant view r|quarry r|research w|reservoir r|7[0-4][0-9][02468] south a|stratford c|sunset c|terrace a|[78][0-9]{3} university a).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C1", result, matchAddr);
              } else if (/.*(boundary r|briarcliff l|camberwell c|canterbury c|clovernook (c|r)|club c|devonshire c|falcon c|fargo c|fortune d|1[0-5][0-9]{2} n(orth)? gammon r|granite c|e(ast)? hamstead c|w(est)? hampstead c|1[23][0-9][13579] n(orth)? high point r|hunter'?s c|7[4-6][0-9]{2} kenyon d|knights c|lannon stone c|1[2-6][0-9]{2} middleton s|muirfield c|15[0-9]{2} park s|park shores c|1[4-6][0-9][13579] pond view (c|r)|quartz c|red oak c|rooster r|sandstone c|sellery s|shirley (c|s)sleepy hollow c|7[2-4][0-9][13579] south a|squire c|stone glen d|stonefield c|6[3-7][0-9]{2} stonefield r|sweeney d|voss p|westchester d|n(orth)? westfield r|windfield w|woodgate r|wydown c).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C2", result, matchAddr);
              } else if (/.*(anderson a|beechwood c|boulder l|[0-9]{3}[02468] branch s|2[0-2][0-9]{2} bristol s|clark s|columbus d|coolidge c|cooper (a|c)|countryside d|cypress t|dohse c|(6[2-5][0-9][13579]|6[6-9][0-9]{2}) elmwood a|franklin a|gateway s|6[3-9][0-9]{2} hubbard a|lee s|maple (c|s)|mayflower d|(6[6-9][0-9]{2}|7[0-2][0-9]{2}) maywood a|meadowcrest l|2[01][0-9]{2} middleton s|nina c|north a|orchid l|(16[0-9]{2}|1[7-9][0-9][13579]|2[0-4][0-9]{2}) park s|park lawn p|2[0-4][0-9][13579] parmenter s|pinta c|santa maria c|shady oak c|(6[3-9][0-9]{2}|7[01][0-9][13579]) south a|62[0-9]{2} stonefield r|(6[6-9][0-9][13579]|6(6[5-9][02468]|[7-9][0-9][02468])|7[0-4][0-9][02468]) university a|violet p|walnut c|willow t|wood r|wood c).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C3", result, matchAddr);
              } else if (/.*(adler c|allen b|amherst r|[0-9]{3}[13579] branch s|6[1-5][0-9][13579] century a|century harbor r|charing cross l|countryside l|dewey c|6[2-5][0-9]{2} elmwood a|s(outh)? gateway s|lake s|lakefield c|lakeview (a|b)|6[2-5][0-9]{2} maywood a|maywood c|mendota a|middleton beach r|middleton springs d|mound s|oakwood p|overlook p|paske c|pheasant l|(6([1-5][0-9]{2}|6([01][0-9]|2[0-2]))|6(2(5[1-9]|[6-9][0-9])|[3-5][0-9][13579])|63[0-9]{2}) university a).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C4", result, matchAddr);
              } else if (/.*(airport r|alpha l|bauer c|belle fontaine b|black opal a|bravo l|calla p|caneel t|capitol view r|cardinal d|(6[89][0-9]{2}|[789][0-9]{3}) century a|century p|charis t|charlie l|companion l|delta l|[23][0-9]{3} deming w|discovery d|(6[89][0-9][02468]|7[0-6][0-9]{2}) donna d|eagle d|echo l|evergreen r|fairway p|feather l|flagstone c|forsythia (c|s)|7[0-4][0-9]{2} friendship l|glenn l|glenview c|graber r|(n(orth)?|s(outh)?|w(est)?) greenview d|3[3-9][0-9][02468] high r|kasten c|knool c|laura l|lily l|lisa l|lynn (c|s)|29[0-9]{2} meadowbrook r|misty valley d|mockingbird l|montclair d|murphy d|newton c|niebler l|nightingale (c|l)|northbrook d|nursery d|park c|(2[6-8][0-9][02468]|(29[0-9]{2}|3[0-2][0-9]{2})|3[3-7][0-9]{2}) park s|(2[0-4][0-9][02468]|(2[5-9][0-9]{2}|[34][0-9]{3})) parmenter s|parview r|patty l|peak view w|pinehurst d|(2[0-9]{3}|3[0-2][0-9]{2}) pleasant view r|prairie d|ravine (c|d)|red beryl d|rohlich c|sand pearl t|selleck l|shower c|spring hill c|7[0-9]{3} spring hill d|sunstone l|tribeca d|7[5-9][0-9]{2} university a|university g|uw health c|webber r|white coral w|yukon w).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C5", result, matchAddr);
              } else if (/.*(aldo leopold w|algonquin d|apprentice p|associates w|black cherry l|brookdale d|(6[1-589][0-9][02468]|6[67][0-9]{2}) century a|(n(orth)?|s(outh)?) chickahauk t|conservancy l|diversity r|6[89][0-9][13579] donna d|erdman b|fellowship r|forest glade c|frank lloyd wright a|69[0-9]{2} friendship l|gaylord nelson r|glacier ridge r|harmony w|3[3-9][0-9][13579] high r|john muir d|mandimus c|manito c|marina d|28[0-9]{2} meadowbrook r|old creek rd|(2[6-8]|3[3-8])[0-9][13579] park s|pheasant branch r|phil lewis w|prairie glade r|ramsey r|river birch l|spring grove c|3[67][0-9]{2} spring hill d|strawberry l|whittlesey r).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C6", result, matchAddr);
              } else if (/.*(anna l|aster c|baskerville (a|w)|cedar (c|t|ridge r)|(5[12][0-9][13579]|(5[3-9][0-9]{2}|6[0-9]{3})) century a|clarewood c|connie l|creekview d|dahlia c|dianne d|elm l|hambrecht r|harbor village r|heather (c|r)|hedden r|highland (c|t|w)|jennifer l|jonquil c|5[34][0-9][13579] larkspur r|lincoln s|marigold c|mathews r|mendota d|(3([6-8][0-9][02468]|90[0246])|3[6-9][0-9][13579]) rolling hill d|roosevelt s|sarah l|s(outh)? ridge w|sunrise c|taft s|tomahawk c|valley creek c|valley ridge p|3[4-9][0-9]{2} valley ridge r|waconia l|woodcreek l|woodland t).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C7", result, matchAddr);
              } else if (/.*(augusta d|bishops bay p|blackwolf r|brindisi c|bryanston d|bunker h|callaway c|5[12][0-9][02468] century a|churchill l|concord d|constitution d|(cnty|county) (hwy|highway) q|flyway c|frisco c|goldfinch c|grassland t|heron t|hilltop c|indigo w|iris c|kingsbarns h|larkspur c|54[0-9][02468] larkspur r|lexington (c|d)|marino c|milano c|mirandy rose c|monarch c|napoli l|nappe d|nathan hale c|park t|patrick henry w|prairie rose c|redtail p|rock crest r|39[1-9][0-9] rolling hill d|roma l|salerno c|sandhill d|savannah c|sawgrass t|sedgemeadow r|shorecrest d|signature d| st (andrews|annes) d|teal c|torino c|upland (c|t)|4[0-9]{3} valley ridge r|wenlock rose c).*/i.test(matchAddr)) {
                selectPSTAT(selectList, "D-MID-C8", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine Middleton district; please enter PSTAT manually.]";
              }
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
            case "Monona city":
            case "Verona city":
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: automatic genereation only occurs for libraries that sort by census tract or county subdivision.]";
              break;

             /*** MAIN LIST ***/
            case "Adams city":
              selectPSTAT(selectList, "A-ADM-C", result, matchAddr);
              break;
            case "Adams town":
              if (data[1] === 'Adams') {
                selectPSTAT(selectList, "A-ADM-T", result, matchAddr);
              } else if (data[1] === 'Green') {
                selectPSTAT(selectList, "G-ADA-T", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
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
            case "Belleville village":
              if (data[1] === 'Dane') {
                selectPSTAT(selectList, "D-BEL-VD", result, matchAddr);
              } else if (data[1] === 'Green') {
                selectPSTAT(selectList, "G-BEL-VG", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
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
            case "Brodhead city":
              selectPSTAT(selectList, "G-BROD-C", result, matchAddr);
              break;
            case "Brooklyn town":
              selectPSTAT(selectList, "G-BRO-T", result, matchAddr);
              break;
            case "Brooklyn village":
              if (data[1] === 'Dane') {
                selectPSTAT(selectList, "D-BRO-VD", result, matchAddr);
              } else if (data[1] === 'Green') {
                selectPSTAT(selectList, "G-BRO-GD", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            // For "Brownsville village" see RECIPROCAL COUNTIES
            case "Browntown village":
              selectPSTAT(selectList, "G-BROW-V", result, matchAddr);
              break;
            case "Buena Vista town":
              selectPSTAT(selectList, "P-BUV-T", result, matchAddr);
              break;
            // For "Buffalo town" see RECIPROCAL COUNTIES
            case "Burke town":
              selectPSTAT(selectList, "D-BUR-T", result, matchAddr);
              break;
            // For "Burnett town" see RECIPROCAL COUNTIES
            case "Cadiz town":
              selectPSTAT(selectList, "G-CAD-T", result, matchAddr);
              break;
            // For "Calamus town" see RECIPROCAL COUNTIES
            case "Caledonia town":
              selectPSTAT(selectList, "C-CAL-T", result, matchAddr);
              break;
            case "Cambria village":
              selectPSTAT(selectList, "C-CAM-V", result, matchAddr);
              break;
            case "Cambridge village":
              selectPSTAT(selectList, "D-CAM-VD", result, matchAddr);
              break;
            case "Cameron town":
              selectPSTAT(selectList, "W-CAM-T", result, matchAddr);
              break;
            case "Carson town":
              selectPSTAT(selectList, "P-CAR-T", result, matchAddr);
              break;
            case "Cary town":
              selectPSTAT(selectList, "W-CAR-T", result, matchAddr);
              break;
            case "Cazenovia village":
              selectPSTAT(selectList, "S-CAZ-V", result, matchAddr);
              break;
            // For "Chester town" see RECIPROCAL COUNTIES
            case "Christiana town":
              selectPSTAT(selectList, "D-CHR-T", result, matchAddr);
              break;
            // For "Clark Co No Library" see UNUSED
            // For "Clark Co With Library" see UNUSED
            case "Clarno town":
              selectPSTAT(selectList, "G-CLA-T", result, matchAddr);
              break;
            // For "Clinton village" see RECIPROCAL COUNTIES
            // For "Clyde town" see RECIPROCAL COUNTIES
            // For "Clyman town" see RECIPROCAL COUNTIES
            // For "Clyman village" see RECIPROCAL COUNTIES
            case "Colburn town":
              selectPSTAT(selectList, "A-COL-T", result, matchAddr);
              break;
            // For "Cold Spring town" see RECIPROCAL COUNTIES
            case "Columbus city":
              if (data[1] === 'Columbia') {
                selectPSTAT(selectList, "C-COL-C", result, matchAddr);
              } else if (data[1] === 'Dodge') {
                selectPSTAT(selectList, "O-MWFLS-COLC", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            case "Columbus town":
              selectPSTAT(selectList, "C-COL-T", result, matchAddr);
              break;
            // For "Concord town" see RECIPROCAL COUNTIES
            // For "Cottage Grove town" see FREQUENTLY USED PSTATS
            // For "Cottage Grove village" see FREQUENTLY USED PSTATS
            case "Courtland town":
              selectPSTAT(selectList, "C-COU-T", result, matchAddr);
              break;
            case "Cranmoor town":
              selectPSTAT(selectList, "W-CRAN-T", result, matchAddr);
              break;
            case "Cross Plains town":
              selectPSTAT(selectList, "D-CP-T", result, matchAddr);
              break;
            case "Cross Plains village":
              selectPSTAT(selectList, "D-CP-V", result, matchAddr);
              break;
            case "Dane town":
              selectPSTAT(selectList, "D-DAN-T", result, matchAddr);
              break;
            case "Dane village":
              selectPSTAT(selectList, "D-DAN-V", result, matchAddr);
              break;
            case "Decatur town":
              selectPSTAT(selectList, "D-DEC-T", result, matchAddr);
              break;
            case "Deerfield town":
              selectPSTAT(selectList, "D-DEE-T", result, matchAddr);
              break;
            case "Deerfield village":
              selectPSTAT(selectList, "D-DEE-V", result, matchAddr);
              break;
            case "DeForest village":
              selectPSTAT(selectList, "D-DF-V", result, matchAddr);
              break;
            case "Dekorra town":
              selectPSTAT(selectList, "C-DEK-T", result, matchAddr);
              break;
            case "Dell Prairie town":
              selectPSTAT(selectList, "A-DEL-T", result, matchAddr);
              break;
            case "Dellona town":
              selectPSTAT(selectList, "S-DELL-T", result, matchAddr);
              break;
            case "Delton town":
              selectPSTAT(selectList, "S-DELT-T", result, matchAddr);
              break;
            case "Dewey town":
              selectPSTAT(selectList, "P-DEW-T", result, matchAddr);
              break;
            case "Dexter town":
              selectPSTAT(selectList, "W-DEX-T", result, matchAddr);
              break;
            // For "Dodge Co No Library" see UNUSED
            // For "Dodge Co With Library" see UNUSED
            // For "Dodgeville city" see RECIPROCAL COUNTIES
            // For "Dodgeville town" see RECIPROCAL COUNTIES
            // For "Douglas town" see RECIPROCAL COUNTIES
            case "Doylestown village":
              selectPSTAT(selectList, "C-DOY-V", result, matchAddr);
              break;
            case "Dunkirk Town":
              selectPSTAT(selectList, "D-DUNK-T", result, matchAddr);
              break;
            case "Dunn town":
              selectPSTAT(selectList, "D-DUNN-T", result, matchAddr);
              break;
            // For "Eastern Shores Library System" see UNUSED
            case "Easton town":
              selectPSTAT(selectList, "A-EST-T", result, matchAddr);
              break;
            case "Eau Pleine town":
              selectPSTAT(selectList, "", result, matchAddr);
              break;
            // For "Edgerton city" see RECIPROCAL COUNTIES
            // For "Elba town" see RECIPROCAL COUNTIES
            // For "Elroy city" see RECIPROCAL COUNTIES
            // For "Emmet town" see RECIPROCAL COUNTIES
            // For "Endeavor village" see RECIPROCAL COUNTIES
            // For "Evansville city" see RECIPROCAL COUNTIES
            case "Excelsior town":
              selectPSTAT(selectList, "S-EXC-T", result, matchAddr);
              break;
            case "Exeter town":
              selectPSTAT(selectList, "G-EXE-T", result, matchAddr);
              break;
            case "Fairfield town":
              selectPSTAT(selectList, "S-FAI-T", result, matchAddr);
              break;
            case "Fall River village":
              selectPSTAT(selectList, "C-FR-V", result, matchAddr);
              break;
            // For "Farmington town" see RECIPROCAL COUNTIES
            // For "Fitchburg city" see FREQUENTLY USED PSTATS
            // For "Fort Atkinson city" see RECIPROCAL COUNTIES
            case "Fort Winnebago town":
              selectPSTAT(selectList, "C-FW-T", result, matchAddr);
              break;
            case "Fountain Prairie town":
              selectPSTAT(selectList, "C-FP-T", result, matchAddr);
              break;
            // For "Fox Lake city" see RECIPROCAL COUNTIES
            // For "Fox Lake town" see RECIPROCAL COUNTIES
            case "Franklin town":
              selectPSTAT(selectList, "S-FRA-T", result, matchAddr);
              break;
            case "Freedom town":
              selectPSTAT(selectList, "S-FRE-T", result, matchAddr);
              break;
            case "Friendship village":
              selectPSTAT(selectList, "A-FRN-V", result, matchAddr);
              break;
            case "Friesland village":
              selectPSTAT(selectList, "C-FRI-V", result, matchAddr);
              break;
            case "Grand Rapids town":
              selectPSTAT(selectList, "W-GRAP-T", result, matchAddr);
              break;
            case "Grant town":
              selectPSTAT(selectList, "P-GRT-T", result, matchAddr);
              break;
            // For "Green Lake Co No Library" see UNUSED
            // For "Green Lake Co With Library" see UNUSED
            // For "Green Lake city" see RECIPROCAL COUNTIES
            case "Greenfield town":
              selectPSTAT(selectList, "S-GRE-T", result, matchAddr);
              break;
            case "Hampden town":
              selectPSTAT(selectList, "C-HAM-T", result, matchAddr);
              break;
            case "Hansen Town":
              selectPSTAT(selectList, "W-HAN-T", result, matchAddr);
              break;
            // For "Hartford city" see RECIPROCAL COUNTIES
            // For "Hebron town" see RECIPROCAL COUNTIES
            // For "Helenville town" see RECIPROCAL COUNTIES
            // For "Herman town" see RECIPROCAL COUNTIES
            case "Hewitt village":
              selectPSTAT(selectList, "W-HEW-V", result, matchAddr);
              break;
            // For "Highland town" see RECIPROCAL COUNTIES
            case "Hiles town":
              selectPSTAT(selectList, "W-HIL-T", result, matchAddr);
              break;
            case "Hillpoint village":
              selectPSTAT(selectList, "S-HILL-V", result, matchAddr);
              break;
            // For "Hollandale village" see RECIPROCAL COUNTIES
            case "Honey Creek town":
              selectPSTAT(selectList, "S-HC-T", result, matchAddr);
              break;
            // For "Horicon city" see RECIPROCAL COUNTIES
            // For "Hubbard town" see RECIPROCAL COUNTIES
            case "Hull town":
              selectPSTAT(selectList, "P-HUL-T", result, matchAddr);
              break;
            // For "Hustisford town" see RECIPROCAL COUNTIES
            // For "Hustisford village" see RECIPROCAL COUNTIES
            // For "ILL Out-of-State" see UNUSED
            // For "ILL-Arrowhead Library System" see UNUSED
            // For "ILL-Eastern Shores Library System" see UNUSED
            // For "ILL-Eastern Shores Library System" see UNUSED
            // For "ILL-Kenosha County Library System" see UNUSED
            // For "ILL-Lakeshores Library System" see UNUSED
            // For "ILL-Manitowoc-calumet Library System" see UNUSED
            // For "ILL-Mid-Wisconsin Federated Library System" see UNUSED
            // For "ILL-Milwaukee Co Federated Library System" see UNUSED
            // For "ILL-Nicolet Federated Library System" see UNUSED
            // For "ILL-Northern Waters Library System" see UNUSED
            // For "ILL-Outagamie Waupaca Library System" see UNUSED
            // For "ILL-Southwest Wisconsin Library System" see UNUSED
            // For "ILL-Waukesha County Federated Library System" see UNUSED
            // For "ILL-Winding Rivers Library System" see UNUSED
            // For "ILL-Winnefox Library System" see UNUSED
            // For "ILL-Wisconsin Valley Library System" see UNUSED
            // For "Indianhead Federated Library System" see UNUSED
            // For "Interlibrary Loan" see UNUSED
            // For "Internal" see UNUSED
            // For "Iowa Co No Library" see UNUSED
            // For "Iowa Co With Library" see UNUSED
            // for "Iron Ridge village" see RECIPROCAL COUNTIES
            case "Ironton town":
              selectPSTAT(selectList, "S-IRO-T", result, matchAddr);
              break;
            case "Ironton village":
              selectPSTAT(selectList, "S-IRO-V", result, matchAddr);
              break;
            // For "Ithaca town" see RECIPROCAL COUNTIES
            // For "Ixonia town" see RECIPROCAL COUNTIES
            // For "Jackson Co No Library" see UNUSED
            // For "Jackson Co With Library" see UNUSED
            case "Jackson town":
              selectPSTAT(selectList, "A-JAK-T", result, matchAddr);
              break;
            // For "Janesville city" see RECIPROCAL COUNTIES
            // For "Jefferson Co No Library" see UNUSED
            // For "Jefferson Co With Library" see UNUSED
            // For "Jefferson City" see RECIPROCAL COUNTIES
            case "Jefferson town":
              selectPSTAT(selectList, "G-JEF-T", result, matchAddr);
              break;
            // For "Johnson Creek village" see RECIPROCAL COUNTIES
            case "Jordan town":
              selectPSTAT(selectList, "G-JOR-T", result, matchAddr);
              break;
            case "Junction City village":
              selectPSTAT(selectList, "P-JNC-V", result, matchAddr);
              break;
            // For "Juneau Co No Library" see UNUSED
            // For "Juneau Co With Library" see UNUSED
            // For "Juneau city" see RECIPROCAL COUNTIES
            // For "Kekoskee village" see RECIPROCAL COUNTIES
            // For "Kenosha County Library System" see UNUSED
            // For "Kildare town" see RECIPROCAL COUNTIES
            // For "Kingston town" see RECIPROCAL COUNTIES
            // For "Kingston village" see RECIPROCAL COUNTIES
            // For "Koshkonong town" see RECIPROCAL COUNTIES
            // For "Lac La Belle village" see RECIPROCAL COUNTIES
            // For "Lafayette Co No Library" see UNUSED
            // For "Lafayette Co With Library" see UNUSED
            case "Lake Delton village":
              selectPSTAT(selectList, "S-LD-V", result, matchAddr);
              break;
            // For "Lake Mills city" see RECIPROCAL COUNTIES
            // For "Lake Mills town" see RECIPROCAL COUNTIES
            // for "Lakeshores Library System" see UNUSED
            case "Lanark town":
              selectPSTAT(selectList, "P-LAN-T", result, matchAddr);
              break;
            case "Lavalle town":
              selectPSTAT(selectList, "S-LV-T", result, matchAddr);
              break;
            case "Lavalle village":
              selectPSTAT(selectList, "S-LV-V", result, matchAddr);
              break;
            // For "Lebanon town" see RECIPROCAL COUNTIES
            case "Leeds town":
              selectPSTAT(selectList, "C-LEE-T", result, matchAddr);
              break;
            case "Leola town":
              selectPSTAT(selectList, "A-LEO-T", result, matchAddr);
              break;
            // For "Leroy town" see RECIPROCAL COUNTIES
            case "Lewiston town":
              selectPSTAT(selectList, "C-LEW-T", result, matchAddr);
              break;
            case "Lime Ridge village":
              selectPSTAT(selectList, "S-LR-V", result, matchAddr);
              break;
            case "Lincoln town":
              if (data[1] === 'Adams') {
                selectPSTAT(selectList, "A-LIN-T", result, matchAddr);
              } else if (data[1] === 'Wood') {
                selectPSTAT(selectList, "W-LIN-T", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            case "Linwood town":
              selectPSTAT(selectList, "P-LIN-T", result, matchAddr);
              break;
            case "Lodi city":
              selectPSTAT(selectList, "C-LOD-C", result, matchAddr);
              break;
            case "Lodi town":
              selectPSTAT(selectList, "C-LOD-T", result, matchAddr);
              break;
            case "Loganville village":
              selectPSTAT(selectList, "S-LOG-V", result, matchAddr);
              break;
            // For "Lomira town" see RECIPROCAL COUNTIES
            // For "Lomira village" see RECIPROCAL COUNTIES
            // For "Lone Rock village" see RECIPROCAL COUNTIES
            // For "Lowell town" see RECIPROCAL COUNTIES
            // For "Lowell village" see RECIPROCAL COUNTIES
            case "Lowville town":
              selectPSTAT(selectList, "C-LOW-T", result, matchAddr);
              break;
            // For "Lyndon town" see RECIPROCAL COUNTIES
            // For "Mackford town" see RECIPROCAL COUNTIES
            // For "Madison city" see FREQUENTLY USED PSTATS
            // For "Madison town" see FREQUENTLY USED PSTATS
            // For "Manchester town" see RECIPROCAL COUNTIES
            // For "Manitowoc-Calumet Library System" see UNUSED
            case "Maple Bluff village":
              selectPSTAT(selectList, "D-MB-V", result, matchAddr);
              break;
            // For "Marathon Co With Library" see UNUSED
            case "Marcellon town":
              selectPSTAT(selectList, "C-MARC-T", result, matchAddr);
              break;
            // For "Markesan city see RECIPROCAL COUNTIES
            // For "Marquette Co No Library" see UNUSED
            // For "Marquette Co With Library" see UNUSED
            case "Marshall village":
              selectPSTAT(selectList, "D-MARS-V", result, matchAddr);
              break;
            case "Marshfield city":
              selectPSTAT(selectList, "W-MAR-C", result, matchAddr);
              break;
            case "Marshfield town":
              selectPSTAT(selectList, "W-MAR-T", result, matchAddr);
              break;
            // For "Mauston city" see RECIPROCAL COUNTIES
            // For "Mayville city" see RECIPROCAL COUNTIES
            case "Mazomanie town":
              selectPSTAT(selectList, "D-MAZ-T", result, matchAddr);
              break;
            case "Mazomanie village":
              selectPSTAT(selectList, "D-MAZ-V", result, matchAddr);
              break;
            case "Mcfarland village":
              selectPSTAT(selectList, "D-MCF-V", result, matchAddr);
              break;
            case "Medina town":
              selectPSTAT(selectList, "D-MED-T", result, matchAddr);
              break;
            case "Merrimac town":
              selectPSTAT(selectList, "S-MER-T", result, matchAddr);
              break;
            case "Merrimac village":
              selectPSTAT(selectList, "S-MER-V", result, matchAddr);
              break;
            // For "Mid-Wisconsin Federated Library System" see UNUSED
            // For "Middleton city" see FREQUENTLY USED PSTATS
            // For "Middleton town" see FREQUENTLY USED PSTATS
            // For "Milford town" see RECIPROCAL COUNTIES
            case "Milladore town":
              selectPSTAT(selectList, "W-MILL-T", result, matchAddr);
              break;
            case "Milladore village":
              selectPSTAT(selectList, "W-MILL-V", result, matchAddr);
              break;
            // For "Milton city: see RECIPROCAL COUNTIES
            // For "Milwaukee County Federated Library System" see UNUSED
            // For "Mineral Point city" see RECIPROCAL COUNTIES
            // For "Mineral Point town" see RECIPROCAL COUNTIES
            // For "Monona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Monroe City":
              selectPSTAT(selectList, "G-MONR-C", result, matchAddr);
              break;
            // For "Monroe School District" see UNUSED
            case "Monroe town":
              if (data[1] === 'Adams') {
                selectPSTAT(selectList, "A-MON-T", result, matchAddr);
              } else if (data[1] === 'Green') {
                selectPSTAT(selectList, "G-MONR-T", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            // For "Montello city" see RECIPROCAL COUNTIES
            // For "Montello town" see RECIPROCAL COUNTIES
            case "Monticello village":
              selectPSTAT(selectList, "G-MONT-V", result, matchAddr);
              break;
            case "Montrose town":
              selectPSTAT(selectList, "D-MONT-T", result, matchAddr);
              break;
            // For "Moscow town" see RECIPROCAL COUNTIES
            // For "Moundville town" see RECIPROCAL COUNTIES
            case "Mount Horeb village":
              selectPSTAT(selectList, "D-MH-V", result, matchAddr);
              break;
            case "Mount Pleasant town":
              selectPSTAT(selectList, "G-MP-T", result, matchAddr);
              break;
            // For "Necedah village" see RECIPROCAL COUNTIES
            case "Nekoosa city":
              selectPSTAT(selectList, "W-NEK-C", result, matchAddr);
              break;
            case "Nelsonville village":
              selectPSTAT(selectList, "P-NEL-V", result, matchAddr);
              break;
            // For "Neosho village" see RECIPROCAL COUNTIES
            // For "Neshkoro village" see RECIPROCAL COUNTIES
            case "New Chester town":
              selectPSTAT(selectList, "A-NCH-T", result, matchAddr);
              break;
            case "New Glarus town":
              selectPSTAT(selectList, "G-NG-T", result, matchAddr);
              break;
            case "New Glarus village":
              selectPSTAT(selectList, "G-NG-V", result, matchAddr);
              break;
            case "New Haven town":
              selectPSTAT(selectList, "A-NHV-T", result, matchAddr);
              break;
            case "New Hope town":
              selectPSTAT(selectList, "P-NHP-T", result, matchAddr);
              break;
            // For "New Lisbon city" see RECIPROCAL COUNTIES
            case "Newport town":
              selectPSTAT(selectList, "C-NEW-T", result, matchAddr);
              break;
            // For "Nicolet Federated Library System" see RECIPROCAL COUNTIES
            case "North Freedom village":
              selectPSTAT(selectList, "S-NF-V", result, matchAddr);
              break;
            // For "Northern Waters Library System" see UNUSED
            // For "Oak Grove town" see RECIPROCAL COUNTIES
            // For "Oakland town" see RECIPROCAL COUNTIES
            case "Oregon town":
              selectPSTAT(selectList, "D-ORE-T", result, matchAddr);
              break;
            case "Oregon village":
              selectPSTAT(selectList, "D-ORE-V", result, matchAddr);
              break;
            // For "Orfordville city" see RECIPROCAL COUNTIES
            // For "Orion town" see RECIPROCAL COUNTIES
            case "Otsego town":
              selectPSTAT(selectList, "C-OTS-T", result, matchAddr);
              break;
            // For "Out-of-State" see UNUSED
            // For "Outagamie Waupaca Library System" see UNUSED
            // For "Oxford town" see RECIPROCAL COUNTIES
            // For "Oxford Village" see RECIPROCAL COUNTIES
            case "Pacific town":
              selectPSTAT(selectList, "C-PAC-T", result, matchAddr);
              break;
            // For "Packwaukee town" see RECIPROCAL COUNTIES
            // For "Palmyra town" see RECIPROCAL COUNTIES
            // For "Palmyra village" see RECIPROCAL COUNTIES
            case "Pardeeville village":
              selectPSTAT(selectList, "C-PAR-V", result, matchAddr);
              break;
            case "Park Ridge village":
              selectPSTAT(selectList, "P-PKR-V", result, matchAddr);
              break;
            case "Perry town":
              selectPSTAT(selectList, "D-PER-T", result, matchAddr);
              break;
            case "Pine Grove town":
              selectPSTAT(selectList, "P-PIN-T", result, matchAddr);
              break;
            case "Pittsville city":
              selectPSTAT(selectList, "W-PIT-C", result, matchAddr);
              break;
            case "Plain village":
              selectPSTAT(selectList, "S-PLA-V", result, matchAddr);
              break;
            case "Pleasant Springs town":
              selectPSTAT(selectList, "D-PS-T", result, matchAddr);
              break;
            case "Plover town":
              selectPSTAT(selectList, "P-PLO-T", result, matchAddr);
              break;
            case "Plover village":
              selectPSTAT(selectList, "P-PLO-V", result, matchAddr);
              break;
            case "Port Edwards town":
              selectPSTAT(selectList, "W-PE-T", result, matchAddr);
              break;
            case "Port Edwards village":
              selectPSTAT(selectList, "W-PE-V", result, matchAddr);
              break;
            case "Portage city":
              selectPSTAT(selectList, "C-POR-C", result, matchAddr);
              break;
            // For "Portland town" see RECIPROCAL COUNTIES
            case "Poynette village":
              selectPSTAT(selectList, "C-POY-V", result, matchAddr);
              break;
            case "Prairie Du Sac town":
              selectPSTAT(selectList, "S-PDS-T", result, matchAddr);
              break;
            case "Prairie Du Sac village":
              selectPSTAT(selectList, "S-PDS-V", result, matchAddr);
              break;
            case "Preston town":
              selectPSTAT(selectList, "A-PRS-T", result, matchAddr);
              break;
            case "Primrose town":
              selectPSTAT(selectList, "D-PRI-T", result, matchAddr);
              break;
            // For "Princeton city" see RECIPROCAL COUNTIES
            // For "Pulaksi town" see RECIPROCAL COUNTIES
            case "Quincy town":
              selectPSTAT(selectList, "A-QUI-T", result, matchAddr);
              break;
            case "Randolph town":
              selectPSTAT(selectList, "C-RAN-T", result, matchAddr);
              break;
            case "Randolph village":
              selectPSTAT(selectList, "C-RAN-VC", result, matchAddr);
              break;
            case "Reedsburg city":
              selectPSTAT(selectList, "S-REE-C", result, matchAddr);
              break;
            case "Reedsburg town":
              selectPSTAT(selectList, "S-REE-T", result, matchAddr);
              break;
            // For "Reeseville village" see RECIPROCAL COUNTIES
            case "Remington town":
              selectPSTAT(selectList, "W-REM-T", result, matchAddr);
              break;
            case "Richfield town":
              if (data[1] === 'Adams') {
                selectPSTAT(selectList, "A-RCH-T", result, matchAddr);
              } else if (data[1] === 'Wood') {
                selectPSTAT(selectList, "W-RCH-T", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            // For "Richland Center city" see RECIPROCAL COUNTIES
            // For "Richland Co No Library" see UNUSED
            // For "Richland Co With Library" see UNUSED
            // For "Richland town" see RECIPROCAL COUNTIES
            // For "Ridgeway town" see RECIPROCAL COUNTIES
            // For "Ridgeway village" see RECIPROCAL COUNTIES
            case "Rio village":
              selectPSTAT(selectList, "C-RIO-V", result, matchAddr);
              break;
            // For "Rock Co No Library" see UNUSED
            // For "Rock Co With Library" see UNUSED
            case "Rock Springs village":
              selectPSTAT(selectList, "S-RS-V", result, matchAddr);
              break;
            case "Rock town":
              selectPSTAT(selectList, "W-ROC-T", result, matchAddr);
              break;
            case "Rockdale village":
              selectPSTAT(selectList, "D-ROC-V", result, matchAddr);
              break;
            case "Rome town":
              selectPSTAT(selectList, "A-ROM-T", result, matchAddr);
              break;
            case "Rosholt village":
              selectPSTAT(selectList, "P-ROS-V", result, matchAddr);
              break;
            case "Roxbury town":
              selectPSTAT(selectList, "D-ROX-T", result, matchAddr);
              break;
            // For "Rubicon town" see RECIPROCAL COUNTIES
            case "Rudolph town":
              selectPSTAT(selectList, "W-RUD-T", result, matchAddr);
              break;
            case "Rudolph village":
              selectPSTAT(selectList, "W-RUD-V", result, matchAddr);
              break;
            case "Rutland town":
              selectPSTAT(selectList, "D-RUT-T", result, matchAddr);
              break;
            case "Saratoga town":
              selectPSTAT(selectList, "W-SARA-T", result, matchAddr);
              break;
            case "Sauk City village":
              selectPSTAT(selectList, "S-SC-V", result, matchAddr);
              break;
            case "Scott town":
              selectPSTAT(selectList, "C-SCO-T", result, matchAddr);
              break;
            case "Seneca town":
              selectPSTAT(selectList, "W-SENE-T", result, matchAddr);
              break;
            // For "Seven Mile Creek town" see RECIPROCAL COUNTIES
            case "Sharon town":
              selectPSTAT(selectList, "P-SHA-T", result, matchAddr);
              break;
            case "Sherry town":
              selectPSTAT(selectList, "W-SHR-T", result, matchAddr);
              break;
            // For "Shields town" see RECIPROCAL COUNTIES
            case "Shorewood Hills village":
              selectPSTAT(selectList, "D-SH-V", result, matchAddr);
              break;
            case "Sigel town":
              selectPSTAT(selectList, "W-SIG-T", result, matchAddr);
              break;
            // For "Southwest Wisconsin Library System" see UNUSED
            case "Spring Green town":
              selectPSTAT(selectList, "S-SGE-T", result, matchAddr);
              break;
            case "Spring Green village":
              selectPSTAT(selectList, "S-SGE-V", result, matchAddr);
              break;
            case "Spring Grove town":
              selectPSTAT(selectList, "G-SGO-T", result, matchAddr);
              break;
            case "Springdale town":
              selectPSTAT(selectList, "D-SPD-T", result, matchAddr);
              break;
            case "Springfield town":
              selectPSTAT(selectList, "D-SPF-T", result, matchAddr);
              break;
            case "Springvale town":
              selectPSTAT(selectList, "C-SPV-T", result, matchAddr);
              break;
            case "Springville town":
              selectPSTAT(selectList, "A-SPV-T", result, matchAddr);
              break;
            case "Stevens Point city":
              selectPSTAT(selectList, "P-STP-C", result, matchAddr);
              break;
            case "Stockton town":
              selectPSTAT(selectList, "P-STO-T", result, matchAddr);
              break;
            case "Stoughton city":
              selectPSTAT(selectList, "D-STO-C1", result, matchAddr);
              break;
            case "Strongs Prairie town":
              selectPSTAT(selectList, "A-STP-T", result, matchAddr);
              break;
            // For "Sullivan town" see RECIPROCAL COUNTIES
            // For "Sullivan village" RECIPROCAL COUNTIES
            // For "Sumner town" see RECIPROCAL COUNTIES
            case "Sumpter town":
              selectPSTAT(selectList, "S-SUM-T", result, matchAddr);
              break;
            // For "Sun Prairie city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Sun Prairie town":
              selectPSTAT(selectList, "D-SP-T", result, matchAddr);
              break;
            case "Sylvester town":
              selectPSTAT(selectList, "G-SYL-T", result, matchAddr);
              break;
            // For "Theresa town" see RECIPROCAL COUNTIES
            // For "Theresa village" see RECIPROCAL COUNTIES
            // For "Trenton town" see RECIPROCAL COUNTIES
            case "Troy town":
              selectPSTAT(selectList, "S-TRO-T", result, matchAddr);
              break;
            // For "Undetermined" see DEFAULT
            case "Vermont town":
              selectPSTAT(selectList, "D-VERM-T", result, matchAddr);
              break;
            // For "Vernon Co No Library" see UNUSED
            // For "Vernon Co With Library" see UNUSED
            case "Verona town":
              selectPSTAT(selectList, "D-VERO-T", result, matchAddr);
              break;
            // For "Verona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Vesper village":
              selectPSTAT(selectList, "W-VESP-V", result, matchAddr);
              break;
            case "Vienna town":
              selectPSTAT(selectList, "D-VIE-T", result, matchAddr);
              break;
            // For "Waldwick town" see RECIPROCAL COUNTIES
            case "Washington town":
              if (data[1] === 'Green') {
                selectPSTAT(selectList, "G-WAS-TG", result, matchAddr);
              } else if (data[1] === 'Sauk') {
                selectPSTAT(selectList, "S-WAS-TS", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            // For "Waterloo city" see RECIPROCAL COUNTIES
            // For "Waterloo city" see RECIPROCAL COUNTIES
            // For "Waterloo town" see RECIPROCAL COUNTIES
            // For "Watertown town" see RECIPROCAL COUNTIES
            // For "Waukesha County Federated Library System" see UNUSED
            case "Waunakee village":
              selectPSTAT(selectList, "D-WAU-V", result, matchAddr);
              break;
            // For "Waupaca Co No Library" see UNUSED
            // For "Waupaca Co With Library" see UNUSED
            // For "Waupun City" see RECIPROCAL COUNTIES
            // For "Waushara Co No Library" see UNUSED
            // For "Waushara Co With Library" see UNUSED
            case "West Baraboo village":
              selectPSTAT(selectList, "S-WB-V", result, matchAddr);
              break;
            case "West Point town":
              selectPSTAT(selectList, "C-WP-T", result, matchAddr);
              break;
            case "Westfield town":
              selectPSTAT(selectList, "S-WESF-T", result, matchAddr);
              break;
            // For "Westfield village" see RECIPROCAL COUNTIES
            // For "Westford town" see RECIPROCAL COUNTIES
            case "Westport town":
              selectPSTAT(selectList, "D-WESP-T", result, matchAddr);
              break;
            // For "Whitewater city" see RECIPROCAL COUNTIES
            case "Whiting village":
              selectPSTAT(selectList, "P-WHI-V", result, matchAddr);
              break;
            // For "Williamstown town" see RECIPROCAL COUNTIES
            // For Willow town" see RECIPROCAL COUNTIES
            // For "Winding Rivers Library System" see UNUSED
            case "Windsor town":
              selectPSTAT(selectList, "D-WIN-T", result, matchAddr);
              break;
            case "Winfield town":
              selectPSTAT(selectList, "S-WIN-T2", result, matchAddr);
              break;
            // For "Winnefox Library System" see UNUSED
            case "Wisconsin Dells city":
              if (data[1] === 'Adams') {
                selectPSTAT(selectList, "A-WID-C", result, matchAddr);
              } else if (data[1] === 'Columbia') {
                selectPSTAT(selectList, "C-WD-CC", result, matchAddr);
              } else if (data[1] === 'Sauk') {
                selectPSTAT(selectList, "S-WD-CS", result, matchAddr);
              } else {
                selectUND(selectList);
                result.setAttribute('style', 'display:inline-block');
                result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              }
              break;
            case "Wisconsin Rapids city":
              selectPSTAT(selectList, "W-WSRP-C", result, matchAddr);
              break;
            // For "Wisconsin Valley Library System" see UNUSED
            // For "Wonewoc village" see RECIPROCAL COUNTIES
            case "Wood town":
              selectPSTAT(selectList, "W-WOD-T", result, matchAddr);
              break;
            case "Woodland town":
              selectPSTAT(selectList, "S-WOO-T", result, matchAddr);
              break;
            case "Wyocena town":
              selectPSTAT(selectList, "C-WYO-T", result, matchAddr);
              break;
            case "Wyocena village":
              selectPSTAT(selectList, "C-WYO-V", result, matchAddr);
              break;
            // For "Wyoming town" see RECIPROCAL COUNTIES
            // For "X-Do Not Use" see UNUSED
            // For "X-Do Not Use" see UNUSED
            // For "York town" (Dane County) see DUPLICATE SUBDIVISION NAMES
            // For "York town" (Green County) see DUPLICATE SUBDIVISION NAMES

            /*** UNUSED AND DEFAULT ***/
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;

          /*** RECIPROCAL COUNTIES ***/
          case "Dodge":
            switch (data[2]) {
            case "Ashippun town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-ASH", result, matchAddr);
              break;
            case "Beaver Dam city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-BVC", result, matchAddr);
              break;
            case "Beaver Dam town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-BVT", result, matchAddr);
              break;
            case "Burnett town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-BRT", result, matchAddr);
              break;
            case "Calamus town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-CALT", result, matchAddr);
              break;
            case "Chester town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-CHE", result, matchAddr);
              break;
            case "Clyman town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-CLYT", result, matchAddr);
              break;
            case "Clyman village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-CLYV", result, matchAddr);
              break;
            case "Elba town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-ELBT", result, matchAddr);
              break;
            case "Emmet town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-EMM", result, matchAddr);
              break;
            case "Fox Lake city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-FXC", result, matchAddr);
              break;
            case "Fox Lake town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-FXT", result, matchAddr);
              break;
            case "Hartford city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HAR", result, matchAddr);
              break;
            case "Herman town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HRT", result, matchAddr);
              break;
            case "Horicon city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HORC", result, matchAddr);
              break;
            case "Hubbard town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HBT", result, matchAddr);
              break;
            case "Hustisford town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HUST", result, matchAddr);
              break;
            case "Hustisford village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-HUSV", result, matchAddr);
              break;
            case "Iron Ridge village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-IRV", result, matchAddr);
              break;
            case "Juneau city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-JUNC", result, matchAddr);
              break;
            case "Kekoskee village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-KEK", result, matchAddr);
              break;
            case "Lebanon town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LBT", result, matchAddr);
              break;
            case "Leroy town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LER", result, matchAddr);
              break;
            case "Lomira town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LOMT", result, matchAddr);
              break;
            case "Lomira village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LOMV", result, matchAddr);
              break;
            case "Lowell town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LOWT", result, matchAddr);
              break;
            case "Lowell village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-LOWV", result, matchAddr);
              break;
            case "Mayville city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-MYC", result, matchAddr);
              break;
            case "Neosho village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-NEO", result, matchAddr);
              break;
            case "Oak Grove town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-OGT", result, matchAddr);
              break;
            case "Portland town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-PRT", result, matchAddr);
              break;
            case "Randolph village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-RANV", result, matchAddr);
              break;
            case "Reeseville village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-RESV", result, matchAddr);
              break;
            case "Rubicon town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-RUB", result, matchAddr);
              break;
            case "Shields town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-SHT", result, matchAddr);
              break;
            case "Theresa town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-THE", result, matchAddr);
              break;
            case "Theresa village": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-THV", result, matchAddr);
              break;
            case "Trenton town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-TRE", result, matchAddr);
              break;
            case "Watertown city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-WD", result, matchAddr);
              break;
            case "Waupun city": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-WP", result, matchAddr);
              break;
            case "Williamstown town": // DODGE COUNTY
              selectPSTAT(selectList, "O-MWFLS-WIL", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Green Lake":
            switch (data[2]) {
            case "Berlin city": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-BLC", result, matchAddr);
              break;
            case "Green Lake city": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-GLC", result, matchAddr);
              break;
            case "Kingston town": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-KNGT", result, matchAddr);
              break;
            case "Kingston village": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-KNGV", result, matchAddr);
              break;
            case "Mackford town": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-MCKT", result, matchAddr);
              break;
            case "Manchester town": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-MANT", result, matchAddr);
              break;
            case "Markesan city": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-MKC", result, matchAddr);
              break;
            case "Princeton city": // GREEN LAKE COUNTY
              selectPSTAT(selectList, "O-WLS-PRC", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Iowa":
            switch (data[2]) {
            case "Arena town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-ART", result, matchAddr);
              break;
            case "Arena village": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-ARV", result, matchAddr);
              break;
            case "Avoca village": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-AVV", result, matchAddr);
              break;
            case "Barneveld village": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-BAV", result, matchAddr);
              break;
            case "Blanchardville village": // LAFAYETTE, IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-BLA", result, matchAddr);
              break;
            case "Brigham town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-BRT", result, matchAddr);
              break;
            case "Clyde town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-CLT", result, matchAddr);
              break;
            case "Dodgeville City": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-DOC", result, matchAddr);
              break;
            case "Dodgeville town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-DOT", result, matchAddr);
              break;
            case "Highland town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-HIT", result, matchAddr);
              break;
            case "Mineral Point city": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-MPC", result, matchAddr);
              break;
            case "Mineral Point town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-MPT", result, matchAddr);
              break;
            case "Moscow town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-MOT", result, matchAddr);
              break;
            case "Pulaksi town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-PUT", result, matchAddr);
              break;
            case "Ridgeway town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-RID", result, matchAddr);
              break;
            case "Ridgeway village": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-RIDV", result, matchAddr);
              break;
            case "Waldwick town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-WLT", result, matchAddr);
              break;
            case "Wyoming town": // IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-WYT", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Jefferson":
            switch (data[2]) {
            case "Aztalan town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-AZT", result, matchAddr);
              break;
            case "Cambridge village": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-CV", result, matchAddr);
              break;
            case "Cold Spring town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-CSP", result, matchAddr);
              break;
            case "Concord town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-CON", result, matchAddr);
              break;
            case "Farmington town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-FAR", result, matchAddr);
              break;
            case "Fort Atkinson city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-FC", result, matchAddr);
              break;
            case "Hebron Town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-HEB", result, matchAddr);
              break;
            case "Helenville town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-HLV", result, matchAddr);
              break;
            case "Ixonia town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-IXT", result, matchAddr);
              break;
            case "Jefferson city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-JC", result, matchAddr);
              break;
            case "Jefferson town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-JFT", result, matchAddr);
              break;
            case "Johnson Creek village": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-JO", result, matchAddr);
              break;
            case "Koshkonong town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-KOS", result, matchAddr);
              break;
            case "Lac La Belle village": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-LLB", result, matchAddr);
              break;
            case "Lake Mills city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-LC", result, matchAddr);
              break;
            case "Lake Mills town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-LT", result, matchAddr);
              break;
            case "Milford town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-MIL", result, matchAddr);
              break;
            case "Oakland town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-OT", result, matchAddr);
              break;
            case "Palmyra town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-PAL", result, matchAddr);
              break;
            case "Palmyra village": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-PA", result, matchAddr);
              break;
            case "Sullivan town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-SLT", result, matchAddr);
              break;
            case "Sullivan village": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-SLV", result, matchAddr);
              break;
            case "Sumner town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-ST", result, matchAddr);
              break;
            case "Waterloo city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "", result, matchAddr);
              break;
            case "Waterloo town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "", result, matchAddr);
              break;
            case "Watertown city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-WT", result, matchAddr);
              break;
            case "Watertown town": // JEFFERSON COUNTY
              selectPSTAT(selectList, "", result, matchAddr);
              break;
            case "Whitewater city": // JEFFERSON COUNTY
              selectPSTAT(selectList, "O-MWFLS-WW", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Juneau":
            switch (data[2]) {
            case "Elroy city": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-ELC", result, matchAddr);
              break;
            case "Kildare town": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-KILDT", result, matchAddr);
              break;
            case "Lyndon town": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-LYNT", result, matchAddr);
              break;
            case "Mauston city": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-MAUC", result, matchAddr);
              break;
            case "Necedah Village": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-NECV", result, matchAddr);
              break;
            case "New Lisbon city": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-NLC", result, matchAddr);
              break;
            case "Seven Mile Creek town": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-7MCT", result, matchAddr);
              break;
            case "Wonewoc village": // JUNEAU COUNTY
              selectPSTAT(selectList, "O-WRLS-WWV", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Lafayette":
            switch (data[2]) {
            case "Blanchardville village": // LAFAYETTE, IOWA COUNTY
              selectPSTAT(selectList, "O-SWLS-BLA", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Marquette":
            switch (data[2]) {
            case "Buffalo town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-BUFT", result, matchAddr);
              break;
            case "Douglas town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-DUGT", result, matchAddr);
              break;
            case "Endeavor village": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-ENV", result, matchAddr);
              break;
            case "Montello city": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-MONV", result, matchAddr);
              break;
            case "Montello town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-MONT", result, matchAddr);
              break;
            case "Moundville town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-MOUT", result, matchAddr);
              break;
            case "Neshkoro village": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-NSKV", result, matchAddr);
              break;
            case "Oxford town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-OXT", result, matchAddr);
              break;
            case "Oxford village": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-OXV", result, matchAddr);
              break;
            case "Packwaukee town": // MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-PCKT", result, matchAddr);
              break;
            case "Westfield village": //  MARQUETTE COUNTY
              selectPSTAT(selectList, "O-WLS-WSFV", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Richland":
            switch (data[2]) {
            case "Buena Vista town": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-WLS-BUFT", result, matchAddr);
              break;
            case "Cazenovia village": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-CAV", result, matchAddr);
              break;
            case "Ithaca town": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-ITT", result, matchAddr);
              break;
            case "Lone Rock village": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-LRV", result, matchAddr);
              break;
            case "Orion town": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-ORT", result, matchAddr);
              break;
            case "Richland Center city": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS", result, matchAddr);
              break;
            case "Richland town": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-RIT", result, matchAddr);
              break;
            case "Willow town": // RICHLAND COUNTY
              selectPSTAT(selectList, "O-SWLS-WIT", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          case "Rock":
            switch (data[2]) {
            case "Brodhead city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-BRD-C", result, matchAddr);
              break;
            case "Clinton village": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-CLI-V", result, matchAddr);
              break;
            case "Edgerton city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-EDG-C", result, matchAddr);
              break;
            case "Evansville city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-EVA-C", result, matchAddr);
              break;
            case "Janesville city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-JAN-C", result, matchAddr);
              break;
            case "Milton city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-MIL-C", result, matchAddr);
              break;
            case "Orfordville city": // ROCK COUNTY
              selectPSTAT(selectList, "O-ALS-ORF-C", result, matchAddr);
              break;
            default:
              selectUND(selectList);
              result.setAttribute('style', 'display:inline-block');
              result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
              break;
            }
            break;
          default:
            selectUND(selectList);
            result.setAttribute('style', 'display:inline-block');
            result.textContent = "[FAILED: unable to determine county; please enter PSTAT manually.]";
            break;
          } //end county switch
        } else { // data === null
          selectUND(selectList);
          result.setAttribute('style', 'display:inline-block');
          result.textContent = "[FAILED: unable to determine county; please enter PSTAT manually.]";
        }
      });
    }
  }

  function queryPSTATPrep() {
    var addr = document.getElementById('address'),
      city = document.getElementById('city');
    if (addr !== null && city !== null) {
      queryPSTAT(addr, city, false);
    }
  }

  function parseMadisonWI(elt) {
    if (/madison(,? wi(sconsin)?)?|mad/i.test(elt.value)) {
      elt.value = "MADISON WI";
    }
    elt.value = elt.value.replace(/,/, '');
  }

  if (addrElt !== null) {
    addrElt.addEventListener('blur', queryPSTATPrep);
    addrElt.parentElement.appendChild(notice);
  }
  if (cityElt !== null) {
    cityElt.addEventListener('blur', function () {
      parseMadisonWI(this);
      pullCity(this.value);
      queryPSTATPrep();
    });
  }

  self.port.on("querySecondaryPSTAT", function () {
    var qspElt = document.getElementById('querySecondaryPSTAT'),
      addrB = document.getElementById('B_address'),
      cityB = document.getElementById('B_city');
    if (qspElt !== undefined && qspElt !== null && addrB !== null && cityB !== null && addrB.value !== '' && cityB.value !== '') {
      queryPSTAT(addrB, cityB, true);
    } else {
      alert('You may only generate the PSTAT value from the ALTERNATE ADDRESS section, NOT the alternate contact section underneath.');
    }
    qspElt.remove();
  });

  self.port.on("querySecondaryPSTATFail", function () {
    var qspFailElt = document.getElementById('querySecondaryPSTATFail');
    if (qspFailElt !== undefined && qspFailElt !== null) {
      alert("You must be currently editing a patron\'s record to generate the PSTAT value from their alternate address");
      qspFailElt.remove();
    }
  });

  /*** CORRECT CITY FORMAT ***/
  var city2 = document.getElementById('B_city'),
    city3 = document.getElementById('altcontactaddress3');

  if (city2 !== null) {
    city2.addEventListener('blur', function () {parseMadisonWI(this); });
  }

  if (city3 !== null) {
    city3.addEventListener('blur', function () {parseMadisonWI(this); });
  }
  }()); //end use strict
