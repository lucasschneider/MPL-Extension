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
      case "n": addrParts[i] = "north"; break;
      case "e": addrParts[i] = "east";  break;
      case "s": addrParts[i] = "south"; break;
      case "w": addrParts[i] = "west"; break;
      default: break;
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
            zipEltB = document.getElementById('B_zipcode'),
            sortIDSet = true,
            sortID = "";

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
            case "Blooming Grove town": sortID = "D-BG-T"; break;
            case "Cottage Grove town": sortID = "D-CG-T"; break;
            case "Cottage Grove village": sortID = "D-CG-V"; break;
            case "Fitchburg city": sortID = "D-FIT-T"; break;
            case "Madison city": sortID = "D-" + data[3]; break;
              // Defined in collegeExp.js
              window.fillDormExp();
              break;
            case "Madison town": sortID = "D-MAD-T"; break;
            case "Middleton city":
              if (/.*(aspen c|aurora s|blackhawk r|blackhawk c|1(8(09|[1-9][0-9])|9[0-9]{2}) bristol s|cayuga s|cobblestone c|1(2[6-9][0-9]|[3-9][0-9]{2}) deming w|elderwood c|7([0-7][0-9]{2}|800) elmwood ave|foxridge c|greenway b|grosse point d|henry c|henry s|(1[2-7][0-9][02468]|1[4-7][0-9][13579]) n(orth)? high point r|hillcrest a|7([0-5][0-9]{2}|600) hubbard a|john q\.? hammons d|77[0-9]{2} kenyon d|market s|meadow c|1[7-9][0-9][02468] middleton s|1[7-9][0-9]{2} park s|(1[4-6][0-9][02468]|1[7-9][0-9]{2}) parmenter s|(1322|1[4-9][0-9]{2}) pleasant view r|quarry r|research w|reservoir r|7[0-4][0-9][02468] south a|stratford c|sunset c|terrace a|[78][0-9]{3} university a).*/i.test(matchAddr)) {
                sortID = "D-MID-C1";
              } else if (/.*(boundary r|briarcliff l|camberwell c|canterbury c|clovernook (c|r)|club c|devonshire c|falcon c|fargo c|fortune d|1[0-5][0-9]{2} n(orth)? gammon r|granite c|e(ast)? hamstead c|w(est)? hampstead c|1[23][0-9][13579] n(orth)? high point r|hunter'?s c|7[4-6][0-9]{2} kenyon d|knights c|lannon stone c|1[2-6][0-9]{2} middleton s|muirfield c|15[0-9]{2} park s|park shores c|1[4-6][0-9][13579] pond view (c|r)|quartz c|red oak c|rooster r|sandstone c|sellery s|shirley (c|s)sleepy hollow c|7[2-4][0-9][13579] south a|squire c|stone glen d|stonefield c|6[3-7][0-9]{2} stonefield r|sweeney d|voss p|westchester d|n(orth)? westfield r|windfield w|woodgate r|wydown c).*/i.test(matchAddr)) {
                sortID = "D-MID-C2";
              } else if (/.*(anderson a|beechwood c|boulder l|[0-9]{3}[02468] branch s|2[0-2][0-9]{2} bristol s|clark s|columbus d|coolidge c|cooper (a|c)|countryside d|cypress t|dohse c|(6[2-5][0-9][13579]|6[6-9][0-9]{2}) elmwood a|franklin a|gateway s|6[3-9][0-9]{2} hubbard a|lee s|maple (c|s)|mayflower d|(6[6-9][0-9]{2}|7[0-2][0-9]{2}) maywood a|meadowcrest l|2[01][0-9]{2} middleton s|nina c|north a|orchid l|(16[0-9]{2}|1[7-9][0-9][13579]|2[0-4][0-9]{2}) park s|park lawn p|2[0-4][0-9][13579] parmenter s|pinta c|santa maria c|shady oak c|(6[3-9][0-9]{2}|7[01][0-9][13579]) south a|62[0-9]{2} stonefield r|(6[6-9][0-9][13579]|6(6[5-9][02468]|[7-9][0-9][02468])|7[0-4][0-9][02468]) university a|violet p|walnut c|willow t|wood r|wood c).*/i.test(matchAddr)) {
                sortID = "D-MID-C3";
              } else if (/.*(adler c|allen b|amherst r|[0-9]{3}[13579] branch s|6[1-5][0-9][13579] century a|century harbor r|charing cross l|countryside l|dewey c|6[2-5][0-9]{2} elmwood a|s(outh)? gateway s|lake s|lakefield c|lakeview (a|b)|6[2-5][0-9]{2} maywood a|maywood c|mendota a|middleton beach r|middleton springs d|mound s|oakwood p|overlook p|paske c|pheasant l|(6([1-5][0-9]{2}|6([01][0-9]|2[0-2]))|6(2(5[1-9]|[6-9][0-9])|[3-5][0-9][13579])|63[0-9]{2}) university a).*/i.test(matchAddr)) {
                sortID = "D-MID-C4";
              } else if (/.*(airport r|alpha l|bauer c|belle fontaine b|black opal a|bravo l|calla p|caneel t|capitol view r|cardinal d|(6[89][0-9]{2}|[789][0-9]{3}) century a|century p|charis t|charlie l|companion l|delta l|[23][0-9]{3} deming w|discovery d|(6[89][0-9][02468]|7[0-6][0-9]{2}) donna d|eagle d|echo l|evergreen r|fairway p|feather l|flagstone c|forsythia (c|s)|7[0-4][0-9]{2} friendship l|glenn l|glenview c|graber r|(n(orth)?|s(outh)?|w(est)?) greenview d|3[3-9][0-9][02468] high r|kasten c|knool c|laura l|lily l|lisa l|lynn (c|s)|29[0-9]{2} meadowbrook r|misty valley d|mockingbird l|montclair d|murphy d|newton c|niebler l|nightingale (c|l)|northbrook d|nursery d|park c|(2[6-8][0-9][02468]|(29[0-9]{2}|3[0-2][0-9]{2})|3[3-7][0-9]{2}) park s|(2[0-4][0-9][02468]|(2[5-9][0-9]{2}|[34][0-9]{3})) parmenter s|parview r|patty l|peak view w|pinehurst d|(2[0-9]{3}|3[0-2][0-9]{2}) pleasant view r|prairie d|ravine (c|d)|red beryl d|rohlich c|sand pearl t|selleck l|shower c|spring hill c|7[0-9]{3} spring hill d|sunstone l|tribeca d|7[5-9][0-9]{2} university a|university g|uw health c|webber r|white coral w|yukon w).*/i.test(matchAddr)) {
                sortID = "D-MID-C5";
              } else if (/.*(aldo leopold w|algonquin d|apprentice p|associates w|black cherry l|brookdale d|(6[1-589][0-9][02468]|6[67][0-9]{2}) century a|(n(orth)?|s(outh)?) chickahauk t|conservancy l|diversity r|6[89][0-9][13579] donna d|erdman b|fellowship r|forest glade c|frank lloyd wright a|69[0-9]{2} friendship l|gaylord nelson r|glacier ridge r|harmony w|3[3-9][0-9][13579] high r|john muir d|mandimus c|manito c|marina d|28[0-9]{2} meadowbrook r|old creek rd|(2[6-8]|3[3-8])[0-9][13579] park s|pheasant branch r|phil lewis w|prairie glade r|ramsey r|river birch l|spring grove c|3[67][0-9]{2} spring hill d|strawberry l|whittlesey r).*/i.test(matchAddr)) {
                sortID = "D-MID-C6";
              } else if (/.*(anna l|aster c|baskerville (a|w)|cedar (c|t|ridge r)|(5[12][0-9][13579]|(5[3-9][0-9]{2}|6[0-9]{3})) century a|clarewood c|connie l|creekview d|dahlia c|dianne d|elm l|hambrecht r|harbor village r|heather (c|r)|hedden r|highland (c|t|w)|jennifer l|jonquil c|5[34][0-9][13579] larkspur r|lincoln s|marigold c|mathews r|mendota d|(3([6-8][0-9][02468]|90[0246])|3[6-9][0-9][13579]) rolling hill d|roosevelt s|sarah l|s(outh)? ridge w|sunrise c|taft s|tomahawk c|valley creek c|valley ridge p|3[4-9][0-9]{2} valley ridge r|waconia l|woodcreek l|woodland t).*/i.test(matchAddr)) {
                sortID = "D-MID-C7";
              } else if (/.*(augusta d|bishops bay p|blackwolf r|brindisi c|bryanston d|bunker h|callaway c|5[12][0-9][02468] century a|churchill l|concord d|constitution d|(cnty|county) (hwy|highway) q|flyway c|frisco c|goldfinch c|grassland t|heron t|hilltop c|indigo w|iris c|kingsbarns h|larkspur c|54[0-9][02468] larkspur r|lexington (c|d)|marino c|milano c|mirandy rose c|monarch c|napoli l|nappe d|nathan hale c|park t|patrick henry w|prairie rose c|redtail p|rock crest r|39[1-9][0-9] rolling hill d|roma l|salerno c|sandhill d|savannah c|sawgrass t|sedgemeadow r|shorecrest d|signature d| st (andrews|annes) d|teal c|torino c|upland (c|t)|4[0-9]{3} valley ridge r|wenlock rose c).*/i.test(matchAddr)) {
                sortID = "D-MID-C8";
              } else {
                sortIDSet = false;
              }
              break;
            case "Middleton town": sortID = "D-MID-T"; break;

            /*** UNDETERMINABLE COUNTY SUBDIVISIONS ***/
            case "Sun Prairie city":
            case "Monona city":
            case "Verona city":
              sortIDSet = false;
              break;

             /*** MAIN LIST ***/
            case "Adams city": sortID = "A-ADM-C"; break;
            case "Adams town":
              if (data[1] === 'Adams') {
                sortID = "A-ADM-T";
              } else if (data[1] === 'Green') {
                sortID = "G-ADA-T";
              } else {
                sortIDSet = false;
              }
              break;
            case "Alban town": sortID = "P-ALB-T"; break;
            case "Albany town": sortID = "G-ALB-T2"; break;
            case "Albany village": sortID = "G-ALB-V"; break;
            case "Albion town": sortID = "D-ALB-T"; break;
            case "Almond town": sortID = "P-ALM-T"; break;
            case "Almond village": sortID = "P-ALM-V"; break;
            case "Amherst Junction village": sortID = "P-AMJ-V"; break;
            case "Amherst town": sortID = "P-AMH-T"; break;
            case "Amherst village": sortID = "P-AMH-V"; break;
            case "Arlington town": sortID = "C-ARL-T"; break;
            case "Arlington village": sortID = "C-ARL-V"; break;
            case "Arpin town": sortID = "W-ARP-T"; break;
            case "Arpin village": sortID = "W-ARP-V"; break;
            // For "Ashippun town" see RECIPROCAL COUNTIES
            case "Auburndale town": sortID = "W-AUB-T"; break;
            case "Auburndale village": sortID = "W-AUB-V"; break;
            // For "Avoca village" see RECIPROCAL COUNTIES
            // For "Aztalan town" see RECIPROCAL COUNTIES
            case "Baraboo city": sortID = "S-BAR-C1"; break;
            case "Baraboo town": sortID = "S-BAR-T"; break;
            // For "Barneveld village" see RECIPROCAL COUNTIES
            case "Bear Creek town": sortID = "S-BC-T"; break;
            // For "Beaver Dam city" see RECIPROCAL COUNTIES
            // For "Beaver Dam town" see RECIPROCAL COUNTIES
            case "Belleville village":
              if (data[1] === 'Dane') {
                sortID ="D-BEL-VD";
              } else if (data[1] === 'Green') {
                sortID = "G-BEL-VG";
              } else {
                sortIDSet = false;
              }
              break;
            case "Belmont town": sortID = "P-BEL-T"; break;
            // For "Beloit city" see RECIPROCAL COUNTIES
            // For "Berlin city" see RECIPROCAL COUNTIES
            case "Berry town": sortID = "D-BERR-T"; break;
            case "Big Flats town": sortID = "D-BIG-T"; break;
            case "Biron village": sortID = "W-BIR-V"; break;
            case "Black Earth town": sortID = "D-BE-T"; break;
            case "Black Earth village": sortID = "B-BE-V"; break;
            // For "Blanchardville village" see RECIPROCAL COUNTIES
            // For "Blooming Grove town" see FREQUENTLY USED PSTATS
            case "Blue Mounds town": sortID = "D-BM-T"; break;
            case "Blue Mounds village": sortID = "D-BM-V"; break;
            // For "Brigham town" see RECIPROCAL COUNTIES
            case "Bristol town": sortID = "D-BRI-T"; break;
            case "Brodhead city": sortID = "G-BROD-C"; break;
            case "Brooklyn town": sortID = "G-BRO-T"; break;
            case "Brooklyn village":
              if (data[1] === 'Dane') {
                sortID = "D-BRO-VD";
              } else if (data[1] === 'Green') {
                sortID = "G-BRO-GD";
              } else {
                sortIDSet = false;
              }
              break;
            // For "Brownsville village" see RECIPROCAL COUNTIES
            case "Browntown village": sortID = "G-BROW-V"; break;
            case "Buena Vista town": sortID = "P-BUV-T"; break;
            // For "Buffalo town" see RECIPROCAL COUNTIES
            case "Burke town": sortID = "D-BUR-T"; break;
            // For "Burnett town" see RECIPROCAL COUNTIES
            case "Cadiz town": sortID = "G-CAD-T"; break;
            // For "Calamus town" see RECIPROCAL COUNTIES
            case "Caledonia town": sortID = "C-CAL-T"; break;
            case "Cambria village": sortID = "C-CAM-V"; break;
            case "Cambridge village": sortID = "D-CAM-VD"; break;
            case "Cameron town": sortID = "W-CAM-T"; break;
            case "Carson town": sortID = "P-CAR-T"; break;
            case "Cary town": sortID = "W-CAR-T"; break;
            case "Cazenovia village": sortID = "S-CAZ-V"; break;
            // For "Chester town" see RECIPROCAL COUNTIES
            case "Christiana town": sortID = "D-CHR-T"; break;
            // For "Clark Co No Library" see UNUSED
            // For "Clark Co With Library" see UNUSED
            case "Clarno town": sortID = "G-CLA-T"; break;
            // For "Clinton village" see RECIPROCAL COUNTIES
            // For "Clyde town" see RECIPROCAL COUNTIES
            // For "Clyman town" see RECIPROCAL COUNTIES
            // For "Clyman village" see RECIPROCAL COUNTIES
            case "Colburn town": sortID = "A-COL-T"; break;
            // For "Cold Spring town" see RECIPROCAL COUNTIES
            case "Columbus city":
              if (data[1] === 'Columbia') {
                sortID = "C-COL-C";
              } else if (data[1] === 'Dodge') {
                sortID = "O-MWFLS-COLC";
              } else {
                sortIDSet = false;
              }
              break;
            case "Columbus town": sortID = "C-COL-T"; break;
            // For "Concord town" see RECIPROCAL COUNTIES
            // For "Cottage Grove town" see FREQUENTLY USED PSTATS
            // For "Cottage Grove village" see FREQUENTLY USED PSTATS
            case "Courtland town": sortID = "C-COU-T"; break;
            case "Cranmoor town": sortID = "W-CRAN-T"; break;
            case "Cross Plains town": sortID = "D-CP-T"; break;
            case "Cross Plains village": sortID = "D-CP-V"; break;
            case "Dane town": sortID = "D-DAN-T"; break;
            case "Dane village": sortID = "D-DAN-V"; break;
            case "Decatur town": sortID = "D-DEC-T"; break;
            case "Deerfield town": sortID = "D-DEE-T"; break;
            case "Deerfield village": sortID = "D-DEE-V"; break;
            case "DeForest village": sortID = "D-DF-V"; break;
            case "Dekorra town": sortID = "C-DEK-T"; break;
            case "Dell Prairie town": sortID = "A-DEL-T"; break;
            case "Dellona town": sortID = "S-DELL-T"; break;
            case "Delton town": sortID = "S-DELT-T"; break;
            case "Dewey town": sortID = "P-DEW-T"; break;
            case "Dexter town": sortID = "W-DEX-T"; break;
            // For "Dodge Co No Library" see UNUSED
            // For "Dodge Co With Library" see UNUSED
            // For "Dodgeville city" see RECIPROCAL COUNTIES
            // For "Dodgeville town" see RECIPROCAL COUNTIES
            // For "Douglas town" see RECIPROCAL COUNTIES
            case "Doylestown village": sortID = "C-DOY-V"; break;
            case "Dunkirk Town": sortID = "D-DUNK-T"; break;
            case "Dunn town": sortID = "D-DUNN-T"; break;
            // For "Eastern Shores Library System" see UNUSED
            case "Easton town": sortID = "A-EST-T"; break;
            case "Eau Pleine town": sortID = ""; break;
            // For "Edgerton city" see RECIPROCAL COUNTIES
            // For "Elba town" see RECIPROCAL COUNTIES
            // For "Elroy city" see RECIPROCAL COUNTIES
            // For "Emmet town" see RECIPROCAL COUNTIES
            // For "Endeavor village" see RECIPROCAL COUNTIES
            // For "Evansville city" see RECIPROCAL COUNTIES
            case "Excelsior town": sortID = "S-EXC-T"; break;
            case "Exeter town": sortID = "G-EXE-T"; break;
            case "Fairfield town": sortID = "S-FAI-T"; break;
            case "Fall River village": sortID = "C-FR-V"; break;
            // For "Farmington town" see RECIPROCAL COUNTIES
            // For "Fitchburg city" see FREQUENTLY USED PSTATS
            // For "Fort Atkinson city" see RECIPROCAL COUNTIES
            case "Fort Winnebago town": sortID = "C-FW-T"; break;
            case "Fountain Prairie town": sortID = "C-FP-T"; break;
            // For "Fox Lake city" see RECIPROCAL COUNTIES
            // For "Fox Lake town" see RECIPROCAL COUNTIES
            case "Franklin town": sortID = "S-FRA-T"; break;
            case "Freedom town": sortID = "S-FRE-T"; break;
            case "Friendship village": sortID = "A-FRN-V"; break;
            case "Friesland village": sortID = "C-FRI-V"; break;
            case "Grand Rapids town": sortID = "W-GRAP-T"; break;
            case "Grant town": sortID = "P-GRT-T"; break;
            // For "Green Lake Co No Library" see UNUSED
            // For "Green Lake Co With Library" see UNUSED
            // For "Green Lake city" see RECIPROCAL COUNTIES
            case "Greenfield town": sortID = "S-GRE-T"; break;
            case "Hampden town": sortID = "C-HAM-T"; break;
            case "Hansen Town": sortID = "W-HAN-T"; break;
            // For "Hartford city" see RECIPROCAL COUNTIES
            // For "Hebron town" see RECIPROCAL COUNTIES
            // For "Helenville town" see RECIPROCAL COUNTIES
            // For "Herman town" see RECIPROCAL COUNTIES
            case "Hewitt village": sortID = "W-HEW-V"; break;
            // For "Highland town" see RECIPROCAL COUNTIES
            case "Hiles town": sortID = "W-HIL-T"; break;
            case "Hillpoint village": sortID = "S-HILL-V"; break;
            // For "Hollandale village" see RECIPROCAL COUNTIES
            case "Honey Creek town": sortID = "S-HC-T"; break;
            // For "Horicon city" see RECIPROCAL COUNTIES
            // For "Hubbard town" see RECIPROCAL COUNTIES
            case "Hull town": sortID = "P-HUL-T"; break;
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
            case "Ironton town": sortID = "S-IRO-T"; break;
            case "Ironton village": sortID = "S-IRO-V"; break;
            // For "Ithaca town" see RECIPROCAL COUNTIES
            // For "Ixonia town" see RECIPROCAL COUNTIES
            // For "Jackson Co No Library" see UNUSED
            // For "Jackson Co With Library" see UNUSED
            case "Jackson town": sortID = "A-JAK-T"; break;
            // For "Janesville city" see RECIPROCAL COUNTIES
            // For "Jefferson Co No Library" see UNUSED
            // For "Jefferson Co With Library" see UNUSED
            // For "Jefferson City" see RECIPROCAL COUNTIES
            case "Jefferson town": sortID = "G-JEF-T"; break;
            // For "Johnson Creek village" see RECIPROCAL COUNTIES
            case "Jordan town": sortID = "G-JOR-T"; break;
            case "Junction City village": sortID = "P-JNC-V"; break;
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
            case "Lake Delton village": sortID = "S-LD-V"; break;
            // For "Lake Mills city" see RECIPROCAL COUNTIES
            // For "Lake Mills town" see RECIPROCAL COUNTIES
            // for "Lakeshores Library System" see UNUSED
            case "Lanark town": sortID = "P-LAN-T"; break;
            case "Lavalle town": sortID = "S-LV-T"; break;
            case "Lavalle village": sortID = "S-LV-V"; break;
            // For "Lebanon town" see RECIPROCAL COUNTIES
            case "Leeds town": sortID = "C-LEE-T"; break;
            case "Leola town": sortID = "A-LEO-T"; break;
            // For "Leroy town" see RECIPROCAL COUNTIES
            case "Lewiston town": sortID = "C-LEW-T"; break;
            case "Lime Ridge village": sortID = "S-LR-V"; break;
            case "Lincoln town":
              if (data[1] === 'Adams') {
                sortID = "A-LIN-T";
              } else if (data[1] === 'Wood') {
                sortID = "W-LIN-T";
              } else {
                sortIDSet = false;
              }
              break;
            case "Linwood town": sortID = "P-LIN-T"; break;
            case "Lodi city": sortID = "C-LOD-C"; break;
            case "Lodi town": sortID = "C-LOD-T"; break;
            case "Loganville village": sortID = "S-LOG-V"; break;
            // For "Lomira town" see RECIPROCAL COUNTIES
            // For "Lomira village" see RECIPROCAL COUNTIES
            // For "Lone Rock village" see RECIPROCAL COUNTIES
            // For "Lowell town" see RECIPROCAL COUNTIES
            // For "Lowell village" see RECIPROCAL COUNTIES
            case "Lowville town": sortID = "C-LOW-T"; break;
            // For "Lyndon town" see RECIPROCAL COUNTIES
            // For "Mackford town" see RECIPROCAL COUNTIES
            // For "Madison city" see FREQUENTLY USED PSTATS
            // For "Madison town" see FREQUENTLY USED PSTATS
            // For "Manchester town" see RECIPROCAL COUNTIES
            // For "Manitowoc-Calumet Library System" see UNUSED
            case "Maple Bluff village": sortID = "D-MB-V"; break;
            // For "Marathon Co With Library" see UNUSED
            case "Marcellon town": sortID = "C-MARC-T"; break;
            // For "Markesan city see RECIPROCAL COUNTIES
            // For "Marquette Co No Library" see UNUSED
            // For "Marquette Co With Library" see UNUSED
            case "Marshall village": sortID = "D-MARS-V"; break;
            case "Marshfield city": sortID = "W-MAR-C"; break;
            case "Marshfield town": sortID = "W-MAR-T"; break;
            // For "Mauston city" see RECIPROCAL COUNTIES
            // For "Mayville city" see RECIPROCAL COUNTIES
            case "Mazomanie town": sortID = "D-MAZ-T"; break;
            case "Mazomanie village": sortID = "D-MAZ-V"; break;
            case "Mcfarland village": sortID = "D-MCF-V"; break;
            case "Medina town": sortID = "D-MED-T"; break;
            case "Merrimac town": sortID = "S-MER-T"; break;
            case "Merrimac village": sortID = "S-MER-V"; break;
            // For "Mid-Wisconsin Federated Library System" see UNUSED
            // For "Middleton city" see FREQUENTLY USED PSTATS
            // For "Middleton town" see FREQUENTLY USED PSTATS
            // For "Milford town" see RECIPROCAL COUNTIES
            case "Milladore town": sortID = "W-MILL-T"; break;
            case "Milladore village": sortID = "W-MILL-V"; break;
            // For "Milton city: see RECIPROCAL COUNTIES
            // For "Milwaukee County Federated Library System" see UNUSED
            // For "Mineral Point city" see RECIPROCAL COUNTIES
            // For "Mineral Point town" see RECIPROCAL COUNTIES
            // For "Monona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Monroe City": sortID = "G-MONR-C"; break;
            // For "Monroe School District" see UNUSED
            case "Monroe town":
              if (data[1] === 'Adams') {
                sortID = "A-MON-T";
              } else if (data[1] === 'Green') {
                sortID = "G-MONR-T";
              } else {
                sortIDSet = false;
              }
              break;
            // For "Montello city" see RECIPROCAL COUNTIES
            // For "Montello town" see RECIPROCAL COUNTIES
            case "Monticello village": sortID = "G-MONT-V"; break;
            case "Montrose town": sortID = "D-MONT-T"; break;
            // For "Moscow town" see RECIPROCAL COUNTIES
            // For "Moundville town" see RECIPROCAL COUNTIES
            case "Mount Horeb village": sortID = "D-MH-V"; break;
            case "Mount Pleasant town": sortID = "G-MP-T"; break;
            // For "Necedah village" see RECIPROCAL COUNTIES
            case "Nekoosa city": sortID = "W-NEK-C"; break;
            case "Nelsonville village": sortID = "P-NEL-V"; break;
            // For "Neosho village" see RECIPROCAL COUNTIES
            // For "Neshkoro village" see RECIPROCAL COUNTIES
            case "New Chester town": sortID = "A-NCH-T"; break;
            case "New Glarus town": sortID = "G-NG-T"; break;
            case "New Glarus village": sortID = "G-NG-V"; break;
            case "New Haven town": sortID = "A-NHV-T"; break;
            case "New Hope town": sortID = "P-NHP-T"; break;
            // For "New Lisbon city" see RECIPROCAL COUNTIES
            case "Newport town": sortID = "C-NEW-T"; break;
            // For "Nicolet Federated Library System" see RECIPROCAL COUNTIES
            case "North Freedom village": sortID = "S-NF-V"; break;
            // For "Northern Waters Library System" see UNUSED
            // For "Oak Grove town" see RECIPROCAL COUNTIES
            // For "Oakland town" see RECIPROCAL COUNTIES
            case "Oregon town": sortID = "D-ORE-T"; break;
            case "Oregon village": sortID = "D-ORE-V"; break;
            // For "Orfordville city" see RECIPROCAL COUNTIES
            // For "Orion town" see RECIPROCAL COUNTIES
            case "Otsego town": sortID = "C-OTS-T"; break;
            // For "Out-of-State" see UNUSED
            // For "Outagamie Waupaca Library System" see UNUSED
            // For "Oxford town" see RECIPROCAL COUNTIES
            // For "Oxford Village" see RECIPROCAL COUNTIES
            case "Pacific town": sortID = "C-PAC-T"; break;
            // For "Packwaukee town" see RECIPROCAL COUNTIES
            // For "Palmyra town" see RECIPROCAL COUNTIES
            // For "Palmyra village" see RECIPROCAL COUNTIES
            case "Pardeeville village": sortID = "C-PAR-V"; break;
            case "Park Ridge village": sortID = "P-PKR-V"; break;
            case "Perry town": sortID = "D-PER-T"; break;
            case "Pine Grove town": sortID = "P-PIN-T"; break;
            case "Pittsville city": sortID = "W-PIT-C"; break;
            case "Plain village": sortID = "S-PLA-V"; break;
            case "Pleasant Springs town": sortID = "D-PS-T"; break;
            case "Plover town": sortID = "P-PLO-T"; break;
            case "Plover village": sortID = "P-PLO-V"; break;
            case "Port Edwards town": sortID = "W-PE-T"; break;
            case "Port Edwards village": sortID = "W-PE-V"; break;
            case "Portage city": sortID = "C-POR-C"; break;
            // For "Portland town" see RECIPROCAL COUNTIES
            case "Poynette village": sortID = "C-POY-V"; break;
            case "Prairie Du Sac town": sortID = "S-PDS-T"; break;
            case "Prairie Du Sac village": sortID = "S-PDS-V"; break;
            case "Preston town": sortID = "A-PRS-T"; break;
            case "Primrose town": sortID = "D-PRI-T"; break;
            // For "Princeton city" see RECIPROCAL COUNTIES
            // For "Pulaksi town" see RECIPROCAL COUNTIES
            case "Quincy town": sortID = "A-QUI-T"; break;
            case "Randolph town": sortID = "C-RAN-T"; break;
            case "Randolph village": sortID = "C-RAN-VC"; break;
            case "Reedsburg city": sortID = "S-REE-C"; break;
            case "Reedsburg town": sortID = "S-REE-T"; break;
            // For "Reeseville village" see RECIPROCAL COUNTIES
            case "Remington town": sortID = "W-REM-T"; break;
            case "Richfield town":
              if (data[1] === 'Adams') {
                sortID = "A-RCH-T";
              } else if (data[1] === 'Wood') {
                sortID = "W-RCH-T";
              } else {
                sortIDSet = false;
              }
              break;
            // For "Richland Center city" see RECIPROCAL COUNTIES
            // For "Richland Co No Library" see UNUSED
            // For "Richland Co With Library" see UNUSED
            // For "Richland town" see RECIPROCAL COUNTIES
            // For "Ridgeway town" see RECIPROCAL COUNTIES
            // For "Ridgeway village" see RECIPROCAL COUNTIES
            case "Rio village": sortID = "C-RIO-V"; break;
            // For "Rock Co No Library" see UNUSED
            // For "Rock Co With Library" see UNUSED
            case "Rock Springs village": sortID = "S-RS-V"; break;
            case "Rock town": sortID = "W-ROC-T"; break;
            case "Rockdale village": sortID = "D-ROC-V"; break;
            case "Rome town": sortID = "A-ROM-T"; break;
            case "Rosholt village": sortID = "P-ROS-V"; break;
            case "Roxbury town": sortID = "D-ROX-T"; break;
            // For "Rubicon town" see RECIPROCAL COUNTIES
            case "Rudolph town": sortID = "W-RUD-T"; break;
            case "Rudolph village": sortID = "W-RUD-V"; break;
            case "Rutland town": sortID = "D-RUT-T"; break;
            case "Saratoga town": sortID = "W-SARA-T"; break;
            case "Sauk City village": sortID = "S-SC-V"; break;
            case "Scott town": sortID = "C-SCO-T"; break;
            case "Seneca town": sortID = "W-SENE-T"; break;
            // For "Seven Mile Creek town" see RECIPROCAL COUNTIES
            case "Sharon town": sortID = "P-SHA-T"; break;
            case "Sherry town": sortID = "W-SHR-T"; break;
            // For "Shields town" see RECIPROCAL COUNTIES
            case "Shorewood Hills village": sortID = "D-SH-V"; break;
            case "Sigel town": sortID = "W-SIG-T"; break;
            // For "Southwest Wisconsin Library System" see UNUSED
            case "Spring Green town": sortID = "S-SGE-T"; break;
            case "Spring Green village": sortID = "S-SGE-V"; break;
            case "Spring Grove town": sortID = "G-SGO-T"; break;
            case "Springdale town": sortID = "D-SPD-T"; break;
            case "Springfield town": sortID = "D-SPF-T"; break;
            case "Springvale town": sortID = "C-SPV-T"; break;
            case "Springville town": sortID = "A-SPV-T"; break;
            case "Stevens Point city": sortID = "P-STP-C"; break;
            case "Stockton town": sortID = "P-STO-T"; break;
            case "Stoughton city": sortID = "D-STO-C1"; break;
            case "Strongs Prairie town": sortID = "A-STP-T"; break;
            // For "Sullivan town" see RECIPROCAL COUNTIES
            // For "Sullivan village" RECIPROCAL COUNTIES
            // For "Sumner town" see RECIPROCAL COUNTIES
            case "Sumpter town": sortID = "S-SUM-T"; break;
            // For "Sun Prairie city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Sun Prairie town": sortID = "D-SP-T"; break;
            case "Sylvester town": sortID = "G-SYL-T"; break;
            // For "Theresa town" see RECIPROCAL COUNTIES
            // For "Theresa village" see RECIPROCAL COUNTIES
            // For "Trenton town" see RECIPROCAL COUNTIES
            case "Troy town": sortID = "S-TRO-T"; break;
            // For "Undetermined" see DEFAULT
            case "Vermont town": sortID = "D-VERM-T"; break;
            // For "Vernon Co No Library" see UNUSED
            // For "Vernon Co With Library" see UNUSED
            case "Verona town": sortID = "D-VERO-T"; break;
            // For "Verona city" see UNDETERMINABLE COUNTY SUBDIVISIONS
            case "Vesper village": sortID = "W-VESP-V"; break;
            case "Vienna town": sortID = "D-VIE-T"; break;
            // For "Waldwick town" see RECIPROCAL COUNTIES
            case "Washington town":
              if (data[1] === 'Green') {
                sortID = "G-WAS-TG";
              } else if (data[1] === 'Sauk') {
                sortID = "S-WAS-TS";
              } else {
                sortIDSet = false;
              }
              break;
            // For "Waterloo city" see RECIPROCAL COUNTIES
            // For "Waterloo city" see RECIPROCAL COUNTIES
            // For "Waterloo town" see RECIPROCAL COUNTIES
            // For "Watertown town" see RECIPROCAL COUNTIES
            // For "Waukesha County Federated Library System" see UNUSED
            case "Waunakee village": sortID = "D-WAU-V"; break;
            // For "Waupaca Co No Library" see UNUSED
            // For "Waupaca Co With Library" see UNUSED
            // For "Waupun City" see RECIPROCAL COUNTIES
            // For "Waushara Co No Library" see UNUSED
            // For "Waushara Co With Library" see UNUSED
            case "West Baraboo village": sortID = "S-WB-V"; break;
            case "West Point town": sortID = "C-WP-T"; break;
            case "Westfield town": sortID = "S-WESF-T"; break;
            // For "Westfield village" see RECIPROCAL COUNTIES
            // For "Westford town" see RECIPROCAL COUNTIES
            case "Westport town": sortID = "D-WESP-T"; break;
            // For "Whitewater city" see RECIPROCAL COUNTIES
            case "Whiting village": sortID = "P-WHI-V"; break;
            // For "Williamstown town" see RECIPROCAL COUNTIES
            // For Willow town" see RECIPROCAL COUNTIES
            // For "Winding Rivers Library System" see UNUSED
            case "Windsor town": sortID = "D-WIN-T"; break;
            case "Winfield town": sortID = "S-WIN-T2"; break;
            // For "Winnefox Library System" see UNUSED
            case "Wisconsin Dells city":
              if (data[1] === 'Adams') {
                sortID = "A-WID-C";
              } else if (data[1] === 'Columbia') {
                sortID = "C-WD-CC";
              } else if (data[1] === 'Sauk') {
                sortID = "S-WD-CS";
              } else {
                sortIDSet = false;
              }
              break;
            case "Wisconsin Rapids city": sortID = "W-WSRP-C"; break;
            // For "Wisconsin Valley Library System" see UNUSED
            // For "Wonewoc village" see RECIPROCAL COUNTIES
            case "Wood town": sortID = "W-WOD-T"; break;
            case "Woodland town": sortID = "S-WOO-T"; break;
            case "Wyocena town": sortID = "C-WYO-T"; break;
            case "Wyocena village": sortID = "C-WYO-V"; break;
            // For "Wyoming town" see RECIPROCAL COUNTIES
            // For "X-Do Not Use" see UNUSED
            // For "X-Do Not Use" see UNUSED
            // For "York town" (Dane County) see DUPLICATE SUBDIVISION NAMES
            // For "York town" (Green County) see DUPLICATE SUBDIVISION NAMES

            /*** UNUSED AND DEFAULT ***/
            default: sortIDSet = false; break;
            }
            break;

          /*** RECIPROCAL COUNTIES ***/
          case "Dodge":
            switch (data[2]) {
            case "Ashippun town": sortID = "O-MWFLS-ASH"; break;
            case "Beaver Dam city": sortID = "O-MWFLS-BVC"; break;
            case "Beaver Dam town": sortID = "O-MWFLS-BVT"; break;
            case "Burnett town": sortID = "O-MWFLS-BRT"; break;
            case "Calamus town": sortID = "O-MWFLS-CALT"; break;
            case "Chester town": sortID = "O-MWFLS-CHE"; break;
            case "Clyman town": sortID = "O-MWFLS-CLYT"; break;
            case "Clyman village": sortID = "O-MWFLS-CLYV"; break;
            case "Elba town": sortID = "O-MWFLS-ELBT"; break;
            case "Emmet town": sortID = "O-MWFLS-EMM"; break;
            case "Fox Lake city": sortID = "O-MWFLS-FXC"; break;
            case "Fox Lake town": sortID = "O-MWFLS-FXT"; break;
            case "Hartford city": sortID = "O-MWFLS-HAR"; break;
            case "Herman town": sortID = "O-MWFLS-HRT"; break;
            case "Horicon city": sortID = "O-MWFLS-HORC"; break;
            case "Hubbard town": sortID = "O-MWFLS-HBT"; break;
            case "Hustisford town": sortID = "O-MWFLS-HUST"; break;
            case "Hustisford village": sortID = "O-MWFLS-HUSV"; break;
            case "Iron Ridge village": sortID = "O-MWFLS-IRV"; break;
            case "Juneau city": sortID = "O-MWFLS-JUNC"; break;
            case "Kekoskee village": sortID = "O-MWFLS-KEK"; break;
            case "Lebanon town": sortID = "O-MWFLS-LBT"; break;
            case "Leroy town": sortID = "O-MWFLS-LER"; break;
            case "Lomira town": sortID = "O-MWFLS-LOMT"; break;
            case "Lomira village": sortID = "O-MWFLS-LOMV"; break;
            case "Lowell town": sortID = "O-MWFLS-LOWT"; break;
            case "Lowell village": sortID = "O-MWFLS-LOWV"; break;
            case "Mayville city": sortID = "O-MWFLS-MYC"; break;
            case "Neosho village": sortID = "O-MWFLS-NEO"; break;
            case "Oak Grove town": sortID = "O-MWFLS-OGT"; break;
            case "Portland town": sortID = "O-MWFLS-PRT"; break;
            case "Randolph village": sortID = "O-MWFLS-RANV"; break;
            case "Reeseville village": sortID = "O-MWFLS-RESV"; break;
            case "Rubicon town": sortID = "O-MWFLS-RUB"; break;
            case "Shields town": sortID = "O-MWFLS-SHT"; break;
            case "Theresa town": sortID = "O-MWFLS-THE"; break;
            case "Theresa village": sortID = "O-MWFLS-THV"; break;
            case "Trenton town": sortID = "O-MWFLS-TRE"; break;
            case "Watertown city": sortID = "O-MWFLS-WD"; break;
            case "Waupun city": sortID = "O-MWFLS-WP"; break;
            case "Williamstown town": sortID = "O-MWFLS-WIL"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Green Lake":
            switch (data[2]) {
            case "Berlin city": sortID = "O-WLS-BLC"; break;
            case "Green Lake city": sortID = "O-WLS-GLC"; break;
            case "Kingston town": sortID = "O-WLS-KNGT"; break;
            case "Kingston village": sortID = "O-WLS-KNGV"; break;
            case "Mackford town": sortID = "O-WLS-MCKT"; break;
            case "Manchester town": sortID = "O-WLS-MANT"; break;
            case "Markesan city": sortID = "O-WLS-MKC"; break;
            case "Princeton city": sortID = "O-WLS-PRC"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Iowa":
            switch (data[2]) {
            case "Arena town": sortID = "O-SWLS-ART"; break;
            case "Arena village": sortID = "O-SWLS-ARV"; break;
            case "Avoca village": sortID = "O-SWLS-AVV"; break;
            case "Barneveld village": sortID = "O-SWLS-BAV"; break;
            case "Blanchardville village": sortID = "O-SWLS-BLA"; break;
            case "Brigham town": sortID = "O-SWLS-BRT"; break;
            case "Clyde town": sortID = "O-SWLS-CLT"; break;
            case "Dodgeville City": sortID = "O-SWLS-DOC"; break;
            case "Dodgeville town": sortID = "O-SWLS-DOT"; break;
            case "Highland town": sortID = "O-SWLS-HIT"; break;
            case "Mineral Point city": sortID = "O-SWLS-MPC"; break;
            case "Mineral Point town": sortID = "O-SWLS-MPT"; break;
            case "Moscow town": sortID = "O-SWLS-MOT"; break;
            case "Pulaksi town": sortID = "O-SWLS-PUT"; break;
            case "Ridgeway town": sortID = "O-SWLS-RID"; break;
            case "Ridgeway village": sortID = "O-SWLS-RIDV"; break;
            case "Waldwick town": sortID = "O-SWLS-WLT"; break;
            case "Wyoming town": sortID = "O-SWLS-WYT"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Jefferson":
            switch (data[2]) {
            case "Aztalan town": sortID = "O-MWFLS-AZT"; break;
            case "Cambridge village": sortID = "O-MWFLS-CV"; break;
            case "Cold Spring town": sortID = "O-MWFLS-CSP"; break;
            case "Concord town": sortID = "O-MWFLS-CON"; break;
            case "Farmington town": sortID = "O-MWFLS-FAR"; break;
            case "Fort Atkinson city": sortID = "O-MWFLS-FC"; break;
            case "Hebron Town": sortID = "O-MWFLS-HEB"; break;
            case "Helenville town": sortID = "O-MWFLS-HLV"; break;
            case "Ixonia town": sortID = "O-MWFLS-IXT"; break;
            case "Jefferson city": sortID = "O-MWFLS-JC"; break;
            case "Jefferson town": sortID = "O-MWFLS-JFT"; break;
            case "Johnson Creek village": sortID = "O-MWFLS-JO"; break;
            case "Koshkonong town": sortID = "O-MWFLS-KOS"; break;
            case "Lac La Belle village": sortID = "O-MWFLS-LLB"; break;
            case "Lake Mills city": sortID = "O-MWFLS-LC"; break;
            case "Lake Mills town": sortID = "O-MWFLS-LT"; break;
            case "Milford town": sortID = "O-MWFLS-MIL"; break;
            case "Oakland town": sortID = "O-MWFLS-OT"; break;
            case "Palmyra town": sortID = "O-MWFLS-PAL"; break;
            case "Palmyra village": sortID = "O-MWFLS-PA"; break;
            case "Sullivan town": sortID = "O-MWFLS-SLT"; break;
            case "Sullivan village": sortID = "O-MWFLS-SLV"; break;
            case "Sumner town": sortID = "O-MWFLS-ST"; break;
            case "Waterloo city": sortID = ""; break;
            case "Waterloo town": sortID = ""; break;
            case "Watertown city": sortID = "O-MWFLS-WT"; break;
            case "Watertown town": sortID = ""; break;
            case "Whitewater city": sortID = "O-MWFLS-WW"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Juneau":
            switch (data[2]) {
            case "Elroy city": sortID = "O-WRLS-ELC"; break;
            case "Kildare town": sortID = "O-WRLS-KILDT"; break;
            case "Lyndon town": sortID = "O-WRLS-LYNT"; break;
            case "Mauston city": sortID = "O-WRLS-MAUC"; break;
            case "Necedah Village": sortID = "O-WRLS-NECV"; break;
            case "New Lisbon city": sortID = "O-WRLS-NLC"; break;
            case "Seven Mile Creek town": sortID = "O-WRLS-7MCT"; break;
            case "Wonewoc village": sortID = "O-WRLS-WWV"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Lafayette":
            switch (data[2]) {
            case "Blanchardville village": sortID = "O-SWLS-BLA"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Marquette":
            switch (data[2]) {
            case "Buffalo town": sortID = "O-WLS-BUFT"; break;
            case "Douglas town": sortID = "O-WLS-DUGT"; break;
            case "Endeavor village": sortID = "O-WLS-ENV"; break;
            case "Montello city": sortID = "O-WLS-MONV"; break;
            case "Montello town": sortID = "O-WLS-MONT"; break;
            case "Moundville town": sortID = "O-WLS-MOUT"; break;
            case "Neshkoro village": sortID = "O-WLS-NSKV"; break;
            case "Oxford town": sortID = "O-WLS-OXT"; break;
            case "Oxford village": sortID = "O-WLS-OXV"; break;
            case "Packwaukee town": sortID = "O-WLS-PCKT"; break;
            case "Westfield village": sortID = "O-WLS-WSFV"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Richland":
            switch (data[2]) {
            case "Buena Vista town": sortID = "O-WLS-BUFT"; break;
            case "Cazenovia village": sortID = "O-SWLS-CAV"; break;
            case "Ithaca town": sortID = "O-SWLS-ITT"; break;
            case "Lone Rock village": sortID = "O-SWLS-LRV"; break;
            case "Orion town": sortID = "O-SWLS-ORT"; break;
            case "Richland Center city": sortID = "O-SWLS"; break;
            case "Richland town": sortID = "O-SWLS-RIT"; break;
            case "Willow town": sortID = "O-SWLS-WIT"; break;
            default: sortIDSet = false; break;
            }
            break;
          case "Rock":
            switch (data[2]) {
            case "Brodhead city": sortID = "O-ALS-BRD-C"; break;
            case "Clinton village": sortID = "O-ALS-CLI-V"; break;
            case "Edgerton city": sortID = "O-ALS-EDG-C"; break;
            case "Evansville city": sortID = "O-ALS-EVA-C"; break;
            case "Janesville city": sortID = "O-ALS-JAN-C"; break;
            case "Milton city": sortID = "O-ALS-MIL-C"; break;
            case "Orfordville city": sortID = "O-ALS-ORF-C"; break;
            default: sortIDSet = false; break;
            }
            break;
          default: sortIDSet = false; break;
          } //end county switch
          if (sortIDSet) {
            selectPSTAT(selectList, sortID, result, matchAddr);
          } else {
            selectUND(selectList);
            result.setAttribute('style', 'display:inline-block');
            result.textContent = "[FAILED: unable to determine county subdivision; please enter PSTAT manually.]";
          }
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
