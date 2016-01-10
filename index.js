/*** IMPORTS ***/
var { ActionButton } = require("sdk/ui/button/action"),
  {ToggleButton} = require('sdk/ui/button/toggle'),
  panels = require("sdk/panel"),
  pageMod = require("sdk/page-mod"),
  prefs = require("sdk/simple-prefs").prefs,
  Request = require("sdk/request").Request,
  windows = require("sdk/windows").browserWindows,
  button,
  mod = null,
  currWorker = null,
  d = new Date(),
  day = d.getUTCDay(),
  patronAddr,
  region;
self = require("sdk/self");
tabs = require("sdk/tabs");
var libraryAddresses = [
  // MPL  [0-8]
  ["HPB", "733+N+High+Point+Rd,+Madison,+WI+53717"],
  ["MAD","201+W+Mifflin+St,+Madison,+WI+53703"],
  ["HAW","2707+E+Washington+Ave,+Madison,+WI+53704"],
  ["LAK","2845+N+Sherman+Ave,+Madison,+WI+53704"],
  ["MEA","5726+Raymond+Rd,+Madison,+WI+53711"],
  ["MSB","1705+Monroe+St,+Madison,+WI+53711"],
  ["PIN","204+Cottage+Grove+Rd,+Madison,+WI+53716"],
  ["SEQ","4340+Tokay+Blvd,+Madison,+WI+53711"],
  ["SMB","2222+S+Park+St,+Madison,+WI+53713"],
	
  // OTHER DANE COUNTY [9-26]
  ["BLV","130+S+Vine+St,+Belleville,+WI+53508"],
  ["BER","1210+Mills+St,+Black+Earth,+WI+53515"],
  ["CBR","101+Spring+Water+Alley,+Cambridge,+WI+53523"],
  ["CSP","2107+Julius+St,+Cross+Plains,+WI+53528"],
  /*DCL NOT INCLUDED*/
  ["DEE","12+W+Nelson+St,+Deerfield,+WI+53531"],
  ["DFT","203+Library+St,+DeForest,+WI+53532"],
  ["FCH","5530+Lacy+Rd,+Fitchburg,+WI+53711"],
  ["MAR","605+Waterloo+Rd,+Marshall,+WI+53559"],
  ["MAZ","102+Brodhead+St,+Mazomanie,+WI+53560"],
  ["MCF","5920+Milwaukee+St,+McFarland,+WI+53558"],
  ["MID","7425+Hubbard+Ave,+Middleton,+WI+53562"],
  ["MOO","1000+Nichols+Rd,+Monona,+WI+53716"],
  ["MTH","105+Perimeter+Rd,+Mount+Horeb,+WI+53572"],
  ["ORE","256+Brook+St,+Oregon,+WI+53575"],
  ["STO","304+S+4th+St,+Stoughton,+WI+53589"],
  ["SUN","1350+Linnerud+Dr,+Sun+Prairie,+WI+53590"],
  ["VER","500+Silent+St,+Verona,+WI+53593"],
  ["WAU","710+South+St,+Waunakee,+WI+53597"],

  // ADAMS COUNTY [27-28]
  ["ACL","569+N+Cedar+St,+Adams,+WI+53910"],
  ["ROM","1157+Rome+Center+Dr,+Nekoosa,+WI+54457"],

  // COLUMBIA COUNTY [29-38]
  ["CIA","109+W+Edgewater+St,+Cambria,+WI+53923"],
  ["COL","223+W+James+St,+Columbus,+WI+53925"],
  ["LDI","130+Lodi+St,+Lodi,+WI+53555"],
  ["PAR","119+N+Main+St,+Pardeeville,+WI+53954"],
  ["POR","253+W+Edgewater+St,+Portage,+WI+53901"],
  ["POY","118+N+Main+St,+Poynette,+WI+53955"],
  ["RAN","228+N+High+St+Randolph,+WI+53956"],
  ["RIO","324+W+Lyons+St,+Rio,+WI+53960"],
  ["WID","620+Elm+St,+Wisconsin+Dells,+WI+53965"],
  ["WYO","165+E+Dodge+St,+Wyocena,+WI+53969"],
  
  // GREEN COUNTY [39-43]
  ["ALB","200+N+Water+St,+Albany,+WI+53502"],
  ["BRD","1207+25th+St,+Brodhead,+WI+53520"],
  ["MRO","925+16th+Ave,+Monroe,+WI+53566"],
  ["MNT","512+E+Lake+Ave,+Monticello,+WI+53570"],
  ["NGL","319+Second+St,+New+Glarus,+WI+53574"],
  
  // PORTAGE COUNTY [44-48]
  ["ALM","122+Main+St,+Almond,+WI+54909"],
  ["AMH","278+N+Main+St,+Amherst,+WI+54406"],
  ["PLO","2151+Roosevelt+Dr,+Plover,+WI+54467"],
  ["ROS","137+N+Main+St,+Rosholt,+WI+54473"],
  ["STP","1001+Main+St,+Stevens+Point,+WI+54481"],
  
  // SAUK COUNTY [49-57]
  ["BAR","230+Fourth+Ave,+Baraboo,+WI+53913"],
  ["LAV","101+W+Main+St,+La+Valle,+WI+53941"],
  ["NOF","105+N+Maple+St,+North+Freedom,+WI+53951"],
  ["PLA","910+Main+St,+Plain,+WI+53577"],
  ["PDS","540+Water+St,+Prairie+du+Sac,+WI+53578"],
  ["REE","370+Vine+St,+Reedsburg,+WI+53959"],
  ["RKS","101+First+St,+Rock+Springs,+WI+53961"],
  ["SKC","515+Water+St,+Sauk+City,+WI+53583"],
  ["SGR","230+E+Monroe+St,+Spring+Green,+WI+53588"],
  
  // WOOD  [58-63]
  ["ARP","8091+County+E,+Arpin,+WI+54410"],
  ["MCM","490+E+Grand+Ave,+Wisconsin+Rapids,+WI+54494"],
  ["MFD","211+E+Second+St,+Marshfield,+WI+54449"],
  ["NEK","100+Park+St,+Nekoosa,+WI+54457"],
  ["PIT","5291+Third+Ave,+Pittsville,+WI+54466"],
  ["VES","6550+Virginia+St,+Vesper,+WI+54489"]
];

/*** MPL Quick Links Button ***/
if (prefs.skin === "MPL") {
  button = ToggleButton({
    id: "mpl-links",
    label: "MPL Quick Links",
    icon: {
      "16": "./MPL/icon-16.png",
      "32": "./MPL/icon-32.png",
      "64": "./MPL/icon-64.png"
    },
    onChange: handleChange
  });
} else if (prefs.skin === "MID") {
  button = ActionButton({
    id: "mid-homepage",
    label: "MID Home Page",
    icon: {
      "16": "./MID/icon-16.png",
      "32": "./MID/icon-32.png",
      "64": "./MID/icon-64.png"
    },

    onClick: function() {
      tabs.open("http://www.midlibrary.org");  
    }
  });
} else {
  button = ActionButton({
    id: "scls-homepage",
    label: "SCLS Home Page",
    icon: {
      "16": "./SCLS/icon-16.png",
      "32": "./SCLS/icon-32.png",
      "64": "./SCLS/icon-64.png"
    },

    onClick: function() {
      tabs.open("http://www.scls.info");  
    }
  });
}

panel = panels.Panel({
    width: 300,
    height: 300,
    contentURL: self.data.url("mplQuickLinks/panel.html"),
    contentStyleFile: self.data.url("mplQuickLinks/panelStyle.css"),
    contentScriptFile: self.data.url("mplQuickLinks/panelScript.js"),
    onHide: handleHide
  });

// Panel listener
panel.port.on("addPaymentPlanNote", function () {
  panel.hide();
  tabs.activeTab.attach({
    contentScriptFile: self.data.url('mplQuickLinks/addPaymentPlanNote.js')
  });
});

panel.port.on("addLostCardNote", function () {
  panel.hide();
  tabs.activeTab.attach({
    contentScriptFile: self.data.url('mplQuickLinks/addLostCardNote.js')
  });
});

panel.port.on("addr2PSTAT", function () {
  panel.hide();
  if (/^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/.test(tabs.activeTab.url)) {
    tabs.activeTab.attach({
      contentScript: "x=document.createElement('span');x.id='querySecondaryPSTAT';x.style.display='none';document.body.appendChild(x);"
    });
    currWorker.port.emit('querySecondaryPSTAT');
  } else {
    tabs.activeTab.attach({
      contentScript: "x=document.createElement('span');x.id='querySecondaryPSTATFail';x.style.display='none';document.body.appendChild(x);"
    });
    currWorker.port.emit('querySecondaryPSTATFail');
  }
});

function handleChange (state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

function portListener(worker) {
  currWorker = worker;
  // On geocoder query
  worker.port.on('queryGeocoder', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city; addr[2] = addr elt; addr[3] = secondPass bool
    if (addr[3]) {
      var getCntySub = Request({
        url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=Counties,Census Tracts,County+Subdivisions,2010+Census+ZIP+Code+Tabulation+Areas&format=json",
        overrideMimeType: "application/json; charset=UTF-8",
        onComplete: function (response) {
          var match = null,
            matchAddr,
            county,
            countySub,
            censusTract,
            zip;

          if (response.json && response.json.result) {
            match = response.json.result;
            if (match) {
              match = match.addressMatches;
              if (match) {
                match = match[0];
                if (match && match !== '') {
                  matchAddr = match.matchedAddress.split(',')[0].toUpperCase();
                  county = match.geographies.Counties[0].BASENAME;
                  countySub = match.geographies[ 'County Subdivisions' ][0].NAME;
                  censusTract = match.geographies[ 'Census Tracts' ][0].BASENAME;
                  zip = match[ 'addressComponents' ].zip;
                }
              }
            }
          }
          if (matchAddr && county && countySub && censusTract && zip) {
            worker.port.emit("receivedGeocoderQuery", [matchAddr,county,countySub,censusTract,zip]);
          } else {
            worker.port.emit("receivedGeocoderQuery", null);
          }
        }
      }).get();
    } else {
      var getCntySub = Request({
        url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Current&vintage=Current_Current&layers=Counties,Census Tracts,County+Subdivisions,2010+Census+ZIP+Code+Tabulation+Areas&format=json",
        overrideMimeType: "application/json; charset=UTF-8",
        onComplete: function (response) {
          var match = null,
            matchAddr,
            county,
            countySub,
            censusTract,
            zip;

          if (response.json && response.json.result) {
            match = response.json.result;
            if (match) {
              match = match.addressMatches;
              if (match) {
                match = match[0];
                if (match && match !== '') {
                  matchAddr = match.matchedAddress;
                  county = match.geographies.Counties[0].BASENAME;
                  countySub = match.geographies[ 'County Subdivisions' ][0].NAME;
                  censusTract = match.geographies[ 'Census Tracts' ][0].BASENAME;
                  zip = match[ 'addressComponents' ].zip;
                }
              }
            }
          }
          if (matchAddr && county && countySub && censusTract && zip) {
            worker.port.emit("receivedGeocoderQuery", [matchAddr,county,countySub,censusTract,zip]);
          } else {
            worker.port.emit("receivedGeocoderQuery", null);
          }
        }
      }).get();
    }
  });

  worker.port.on("disableSundayDropbox", function () {
    prefs.sundayDropbox = false;
  });

  worker.port.on("printBarcode", function (barcode) {
    tabs.open({
      url: "./printBarcode.html",
      inBackground: true,
      onReady: function(tab) {
        tab.attach({
          contentScript: "document.getElementById('barcode').innerHTML = " + barcode + ";window.print();"
        });
        require("sdk/timers").setTimeout(function(){ tab.close(); }, 500);
      }
    });
  });
  
  worker.port.on("findNearestLib", function(data) {
    patronAddr = data[0],
    region = data[1],
    mapURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + data[0] + "&destinations=";
    switch(data[1]) {
      case "MPL":
        for (var idx = 0; idx < 8; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[8][1];
        break;
      case "DANE":
        for (var idx = 0; idx < 26; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[26][1];
        break;
      case "ADAMS":
          mapURL += libraryAddresses[27][1] + "|" + libraryAddresses[28][1];
        break;
      case "COLUMBIA":
        for (var idx = 29; idx < 38; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[38][1];
        break;
      case "GREEN":
        for (var idx = 39; idx < 43; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[43][1];
        break;
      case "PORTAGE":
        for (var idx = 44; idx < 48; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[48][1];
        break;
      case "SAUK":
        for (var idx = 49; idx < 57; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[57][1];
        break;
      case "WOOD":
        for (var idx = 58; idx < 63; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[63][1];
        break;
      case "SCLS":
        for (var idx = 0; idx < 63; idx++) {
          mapURL += libraryAddresses[idx][1] + "|";
        }
        mapURL += libraryAddresses[63][1];
        break;
      default:
        break;
    }
    mapURL += "&key=AIzaSyDQ26hmk6pOolpmzFCWeBl9K6ACVa4xF_k";
    console.log(mapURL);
    var getCntySub = Request({
      url: mapURL,
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var elements = response.json.rows[0].elements,
          closestLib = "";
        if (elements) {
          switch(region) {
            case "MPL":
              var HPBdist = elements[0].distance.value,
                MADdist = elements[1].distance.value,
                HAWdist = elements[2].distance.value,
                LAKdist = elements[3].distance.value,
                MEAdist = elements[4].distance.value,
                MSBdist = elements[5].distance.value,
                PINdist = elements[6].distance.value,
                SEQdist = elements[7].distance.value,
                SMBdist = elements[8].distance.value,
                minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, MSBdist, PINdist, SEQdist, SMBdist);

              switch(minDist) {
                case HPBdist: closestLib = "HPB"; break;
                case MADdist: closestLib = "MAD"; break;
                case HAWdist: closestLib = "HAW"; break;
                case LAKdist: closestLib = "LAK"; break;
                case MEAdist: closestLib = "MEA"; break;
                case MSBdist: closestLib = "MSB"; break;
                case PINdist: closestLib = "PIN"; break;
                case SEQdist: closestLib = "SEQ"; break;
                case SMBdist: closestLib = "SMB"; break;
                default: break;
              }
              break;
            case "ADAMS":
              var ACLdist = elements[0].distance.value,
                ROMdist = elements[1].distance.value,
                minDist = Math.min(ACLdist, ROMdist);
              switch(minDist) {
                case ACLdist: closestLib = "ACL"; break;
                case ROMdist: closestLib = "ROM"; break;
                default: break;
              }
              break;
            case "COLUMBIA":
              var CIAdist = elements[0].distance.value,
                COLdist = elements[1].distance.value,
                LDIdist = elements[2].distance.value,
                PARdist = elements[3].distance.value,
                PORdist = elements[4].distance.value,
                POYdist = elements[5].distance.value,
                RANdist = elements[6].distance.value,
                RIOdist = elements[7].distance.value,
                WIDdist = elements[8].distance.value,
                WYOdist = elements[9].distance.value,
                minDist = Math.min(CIAdist, COLdist, LDIdist, PARdist, PORdist, POYdist, RANdist, RIOdist, WIDdist, WYOdist);
              switch(minDist) {
                case CIAdist: closestLib = "CIA"; break;
                case COLdist: closestLib = "COL"; break;
                case LDIdist: closestLib = "LDI"; break;
                case PARdist: closestLib = "PAR"; break;
                case PORdist: closestLib = "POR"; break;
                case POYdist: closestLib = "POY"; break;
                case RANdist: closestLib = "RAN"; break;
                case RIOdist: closestLib = "RIO"; break;
                case WIDdist: closestLib = "WID"; break;
                case WYOdist: closestLib = "WYO"; break;
                default: break;
              }
              break;
            case "DANE":
              var HPBdist = elements[0].distance.value,
                MADdist = elements[1].distance.value,
                HAWdist = elements[2].distance.value,
                LAKdist = elements[3].distance.value,
                MEAdist = elements[4].distance.value,
                MSBdist = elements[5].distance.value,
                PINdist = elements[6].distance.value,
                SEQdist = elements[7].distance.value,
                SMBdist = elements[8].distance.value,
                BLVdist = elements[9].distance.value,
                BERdist = elements[10].distance.value,
                CBRdist = elements[11].distance.value,
                CSPdist = elements[12].distance.value,
                DEEdist = elements[13].distance.value,
                DFTdist = elements[14].distance.value,
                FCHdist = elements[15].distance.value,
                MARdist = elements[16].distance.value,
                MAZdist = elements[17].distance.value,
                MCFdist = elements[18].distance.value,
                MIDdist = elements[19].distance.value,
                MOOdist = elements[20].distance.value,
                MTHdist = elements[21].distance.value,
                OREdist = elements[22].distance.value,
                STOdist = elements[23].distance.value,
                SUNdist = elements[24].distance.value,
                VERdist = elements[25].distance.value,
                WAUdist = elements[26].distance.value,
                minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, MSBdist, PINdist, SEQdist, SMBdist, BLVdist, BERdist, CBRdist, CSPdist, DEEdist, DFTdist, FCHdist, MARdist, MAZdist, MCFdist, MIDdist, MOOdist, MTHdist, OREdist, STOdist, SUNdist, VERdist, WAUdist);

              switch(minDist) {
                case HPBdist: closestLib = "HPB"; break;
                case MADdist: closestLib = "MAD"; break;
                case HAWdist: closestLib = "HAW"; break;
                case LAKdist: closestLib = "LAK"; break;
                case MEAdist: closestLib = "MEA"; break;
                case MSBdist: closestLib = "MSB"; break;
                case PINdist: closestLib = "PIN"; break;
                case SEQdist: closestLib = "SEQ"; break;
                case SMBdist: closestLib = "SMB"; break;
                case BLVdist: closestLib = "BLV"; break;
                case BERdist: closestLib = "BER"; break;
                case CBRdist: closestLib = "CBR"; break;
                case CSPdist: closestLib = "CSP"; break;
                case DEEdist: closestLib = "DEE"; break;
                case DFTdist: closestLib = "DFT"; break;
                case FCHdist: closestLib = "FCH"; break;
                case MARdist: closestLib = "MAR"; break;
                case MAZdist: closestLib = "MAZ"; break;
                case MCFdist: closestLib = "MCF"; break;
                case MIDdist: closestLib = "MID"; break;
                case MOOdist: closestLib = "MOO"; break;
                case MTHdist: closestLib = "MTH"; break;
                case OREdist: closestLib = "ORE"; break;
                case STOdist: closestLib = "STO"; break;
                case SUNdist: closestLib = "SUN"; break;
                case VERdist: closestLib = "VER"; break;
                case WAUdist: closestLib = "WAU"; break;
                default: break;
              }
              break;
            case "GREEN":
              var ALBdist = elements[0].distance.value,
                BRDdist = elements[1].distance.value,
                MROdist = elements[2].distance.value,
                MNTdist = elements[3].distance.value,
                NGLdist = elements[4].distance.value,
                minDist = Math.min(ALBdist, BRDdist, MROdist, MNTdist, NGLdist);
              switch(minDist) {
                case ALBdist: closestLib = "ALB"; break;
                case BRDdist: closestLib = "BRD"; break;
                case MROdist: closestLib = "MRO"; break;
                case MNTdist: closestLib = "MNT"; break;
                case NGLdist: closestLib = "NGL"; break;
                default: break;
              }
              break;
            case "PORTAGE":
              var ALMdist = elements[0].distance.value,
                AMHdist = elements[1].distance.value,
                PLOdist = elements[2].distance.value,
                ROSdist = elements[3].distance.value,
                STPdist = elements[4].distance.value,
                minDist = Math.min(ALMdist, AMHdist, PLOdist, ROSdist, STPdist);
              switch(minDist) {
                case ALMdist: closestLib = "ALM"; break;
                case AMHdist: closestLib = "AMH"; break;
                case PLOdist: closestLib = "PLO"; break;
                case ROSdist: closestLib = "ROS"; break;
                case STPdist: closestLib = "STP"; break;
                default: break;
              }
              break;
            case "SAUK":
              var BARdist = elements[0].distance.value,
                LAVdist = elements[1].distance.value,
                NOFdist = elements[2].distance.value,
                PLAdist = elements[3].distance.value,
                PDSdist = elements[4].distance.value,
                REEdist = elements[5].distance.value,
                RKSdist = elements[6].distance.value,
                SKCdist = elements[7].distance.value,
                SGRdist = elements[8].distance.value,
                minDist = Math.min(BARdist, LAVdist, NOFdist, PLAdist, PDSdist, REEdist, RKSdist, SKCdist, SGRdist);
              switch(minDist) {
                case BARdist: closestLib = "BAR"; break;
                case LAVdist: closestLib = "LAV"; break;
                case NOFdist: closestLib = "NOF"; break;
                case PLAdist: closestLib = "PLA"; break;
                case PDSdist: closestLib = "PDS"; break;
                case REEdist: closestLib = "REE"; break;
                case RKSdist: closestLib = "RKS"; break;
                case SKCdist: closestLib = "SKC"; break;
                case SGRdist: closestLib = "SGR"; break;
                default: break;
              }
              break;
            case "WOOD":
              var ARPdist = elements[0].distance.value,
                MCMdist = elements[1].distance.value,
                MFDdist = elements[2].distance.value,
                NEKdist = elements[3].distance.value,
                PITdist = elements[4].distance.value,
                VESdist = elements[5].distance.value,
                minDist = Math.min(ARPdist, MCMdist, MFDdist, NEKdist, PITdist, VESdist);
              switch(minDist) {
                case ARPdist: closestLib = "ARP"; break;
                case MCMdist: closestLib = "MCM"; break;
                case MFDdist: closestLib = "MFD"; break;
                case NEKdist: closestLib = "NEK"; break;
                case PITdist: closestLib = "PIT"; break;
                case VESdist: closestLib = "VES"; break;
                default: break;
              }
              break;
            case "SCLS":
              var HPBdist = elements[0].distance.value,
                MADdist = elements[1].distance.value,
                HAWdist = elements[2].distance.value,
                LAKdist = elements[3].distance.value,
                MEAdist = elements[4].distance.value,
                MSBdist = elements[5].distance.value,
                PINdist = elements[6].distance.value,
                SEQdist = elements[7].distance.value,
                SMBdist = elements[8].distance.value,
                BLVdist = elements[9].distance.value,
                BERdist = elements[10].distance.value,
                CBRdist = elements[11].distance.value,
                CSPdist = elements[12].distance.value,
                DEEdist = elements[13].distance.value,
                DFTdist = elements[14].distance.value,
                FCHdist = elements[15].distance.value,
                MARdist = elements[16].distance.value,
                MAZdist = elements[17].distance.value,
                MCFdist = elements[18].distance.value,
                MIDdist = elements[19].distance.value,
                MOOdist = elements[20].distance.value,
                MTHdist = elements[21].distance.value,
                OREdist = elements[22].distance.value,
                STOdist = elements[23].distance.value,
                SUNdist = elements[24].distance.value,
                VERdist = elements[25].distance.value,
                WAUdist = elements[26].distance.value,
                ACLdist = elements[27].distance.value,
                ROMdist = elements[28].distance.value,
                CIAdist = elements[29].distance.value,
                COLdist = elements[30].distance.value,
                LDIdist = elements[31].distance.value,
                PARdist = elements[32].distance.value,
                PORdist = elements[33].distance.value,
                POYdist = elements[34].distance.value,
                RANdist = elements[35].distance.value,
                RIOdist = elements[36].distance.value,
                WIDdist = elements[37].distance.value,
                WYOdist = elements[38].distance.value,
                ALBdist = elements[39].distance.value,
                BRDdist = elements[40].distance.value,
                MROdist = elements[41].distance.value,
                MNTdist = elements[42].distance.value,
                NGLdist = elements[43].distance.value,
                ALMdist = elements[44].distance.value,
                AMHdist = elements[45].distance.value,
                PLOdist = elements[46].distance.value,
                ROSdist = elements[47].distance.value,
                STPdist = elements[48].distance.value,
                BARdist = elements[49].distance.value,
                LAVdist = elements[50].distance.value,
                NOFdist = elements[51].distance.value,
                PLAdist = elements[52].distance.value,
                PDSdist = elements[53].distance.value,
                REEdist = elements[54].distance.value,
                RKSdist = elements[55].distance.value,
                SKCdist = elements[56].distance.value,
                SGRdist = elements[57].distance.value,
                ARPdist = elements[58].distance.value,
                MCMdist = elements[59].distance.value,
                MFDdist = elements[60].distance.value,
                NEKdist = elements[61].distance.value,
                PITdist = elements[62].distance.value,
                VESdist = elements[63].distance.value,
                minDist = Math.min(HPBdist, MADdist, HAWdist, LAKdist, MEAdist, MSBdist, PINdist, SEQdist, SMBdist, BLVdist, BERdist, CBRdist, CSPdist, DEEdist, DFTdist, FCHdist, MARdist, MAZdist, MCFdist, MIDdist, MOOdist, MTHdist, OREdist, STOdist, SUNdist, VERdist, WAUdist, ACLdist, ROMdist, CIAdist, COLdist, LDIdist, PARdist, PORdist, POYdist, RANdist, RIOdist, WIDdist, WYOdist, ALBdist, BRDdist, MROdist, MNTdist, NGLdist, ALMdist, AMHdist, PLOdist, ROSdist, STPdist, BARdist, LAVdist, NOFdist, PLAdist, PDSdist, REEdist, RKSdist, SKCdist, SGRdist, ARPdist, MCMdist, MFDdist, NEKdist, PITdist, VESdist);

              switch(minDist) {
                case HPBdist: closestLib = "HPB"; break;
                case MADdist: closestLib = "MAD"; break;
                case HAWdist: closestLib = "HAW"; break;
                case LAKdist: closestLib = "LAK"; break;
                case MEAdist: closestLib = "MEA"; break;
                case MSBdist: closestLib = "MSB"; break;
                case PINdist: closestLib = "PIN"; break;
                case SEQdist: closestLib = "SEQ"; break;
                case SMBdist: closestLib = "SMB"; break;
                case BLVdist: closestLib = "BLV"; break;
                case BERdist: closestLib = "BER"; break;
                case CBRdist: closestLib = "CBR"; break;
                case CSPdist: closestLib = "CSP"; break;
                case DEEdist: closestLib = "DEE"; break;
                case DFTdist: closestLib = "DFT"; break;
                case FCHdist: closestLib = "FCH"; break;
                case MARdist: closestLib = "MAR"; break;
                case MAZdist: closestLib = "MAZ"; break;
                case MCFdist: closestLib = "MCF"; break;
                case MIDdist: closestLib = "MID"; break;
                case MOOdist: closestLib = "MOO"; break;
                case MTHdist: closestLib = "MTH"; break;
                case OREdist: closestLib = "ORE"; break;
                case STOdist: closestLib = "STO"; break;
                case SUNdist: closestLib = "SUN"; break;
                case VERdist: closestLib = "VER"; break;
                case WAUdist: closestLib = "WAU"; break;
                case ACLdist: closestLib = "ACL"; break;
                case ROMdist: closestLib = "ROM"; break;
                case CIAdist: closestLib = "CIA"; break;
                case COLdist: closestLib = "COL"; break;
                case LDIdist: closestLib = "LDI"; break;
                case PARdist: closestLib = "PAR"; break;
                case PORdist: closestLib = "POR"; break;
                case POYdist: closestLib = "POY"; break;
                case RANdist: closestLib = "RAN"; break;
                case RIOdist: closestLib = "RIO"; break;
                case WIDdist: closestLib = "WID"; break;
                case WYOdist: closestLib = "WYO"; break;
                case ALBdist: closestLib = "ALB"; break;
                case BRDdist: closestLib = "BRD"; break;
                case MROdist: closestLib = "MRO"; break;
                case MNTdist: closestLib = "MNT"; break;
                case NGLdist: closestLib = "NGL"; break;
                case ALMdist: closestLib = "ALM"; break;
                case AMHdist: closestLib = "AMH"; break;
                case PLOdist: closestLib = "PLO"; break;
                case ROSdist: closestLib = "ROS"; break;
                case STPdist: closestLib = "STP"; break;
                case BARdist: closestLib = "BAR"; break;
                case LAVdist: closestLib = "LAV"; break;
                case NOFdist: closestLib = "NOF"; break;
                case PLAdist: closestLib = "PLA"; break;
                case PDSdist: closestLib = "PDS"; break;
                case REEdist: closestLib = "REE"; break;
                case RKSdist: closestLib = "RKS"; break;
                case SKCdist: closestLib = "SKC"; break;
                case SGRdist: closestLib = "SGR"; break;
                default: break;
              }
              break;
            default:
              break;
          }
        }

        if (closestLib && closestLib != "") {
          worker.port.emit("receivedNearestLib", closestLib);
        } else {
          worker.port.emit("failedNearestLib");
        }
      }
    }).get();
  });
}

/*** KOHA MODS ***/
function onPrefChange(prefName) {
  if (mod !== null) {
    mod.destroy();
  }
  var kohaMods = [
    self.data.url("kohaMods/sortLibraries.js"),
    self.data.url("kohaMods/fixSessionCkoDiv.js"),
    self.data.url("kohaMods/printBarcode.js")
  ];
  if (prefs.patronMsg) kohaMods.push(self.data.url("kohaMods/patronMessages.js"));
  if (prefs.autoUserId) kohaMods.push(self.data.url("kohaMods/autofillUserId.js"));
  if (prefs.selectPSTAT) kohaMods.push(self.data.url("kohaMods/selectPSTAT.js"));
  if (prefs.middleName) kohaMods.push(self.data.url("kohaMods/middleName.js"));

  if (prefs.sundayDropbox) {
    if (day === 0) kohaMods.push(self.data.url("kohaMods/sundayDropbox.js"));

    mod = pageMod.PageMod({
      include: /^https?\:\/\/scls-staff\.kohalibrary\.com.*/,
      attachTo: ["top", "frame"],
      contentScriptFile: kohaMods,
      onAttach: portListener
    });
  } else {
    mod = pageMod.PageMod({
      include: /^https?\:\/\/scls-staff\.kohalibrary\.com.*/,
      attachTo: ["top", "frame"],
      contentScriptFile: kohaMods,
      onAttach: portListener
    });
 }
}
onPrefChange("");
require("sdk/simple-prefs").on("sundayDropbox", onPrefChange);

// Reset sundayDropbox to true
windows.on('close', function() {
  if (windows.length === 0) {
    prefs.sundayDropbox = true;
  }
});

/*** KOHA PATRON EDIT MODS ***/
var kohaPatronEditMods = [
  self.data.url("kohaPatronEditModsOnly/standardFormat.js"),
  self.data.url("kohaPatronEditModsOnly/collegeExp.js")
];
if (prefs.forceDigest) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/forceDigest.js"));
if (prefs.restrictNotificationOptions) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/restrictNotificationOptions.js"));
if (prefs.updateAccountType) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/updateAccountType.js"));
if (prefs.validAddr) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/validateAddresses.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/,
  attachTo: ["top","frame"],
  contentScriptFile: kohaPatronEditMods
});
