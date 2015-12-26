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
  day = d.getUTCDay();
self = require("sdk/self");
tabs = require("sdk/tabs");

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
  
  worker.port.on("findNearestLib", function(patronAddr) {
    var getCntySub = Request({
      url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + patronAddr + "&destinations=733+N+High+Point+Rd,+Madison,+WI+53717|201+W+Mifflin+St,+Madison,+WI%2053703|2707+E+Washington+Ave,+Madison,+WI+53704|2845+N+Sherman+Ave,+Madison,+WI+53704|5726+Raymond+Rd,+Madison,+WI+53711|1705+Monroe+St,+Madison,+WI+53711|204+Cottage+Grove+Rd,+Madison,+WI+53716|4340+Tokay+Blvd,+Madison,+WI+53711|2222+S+Park+St,+Madison,+WI+53713&key=AIzaSyDQ26hmk6pOolpmzFCWeBl9K6ACVa4xF_k",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var elements = response.json.rows[0].elements,
          closestLib = "";
        if (elements) {
          var HPBdist = elements[0].distance.value,
            MADdist = elements[1].distance.value,
            HAWdist = elements[2].distance.value,
            LAKdist = elements[3].distance.value,
            MEAdist = elements[4].distance.value,
            MSBdist = elements[5].distance.value,
            PINdist = elements[6].distance.value,
            SEQdist = elements[7].distance.value,
            SMBdist = elements[8].distance.value,
            minDist = Math.min(HPBdist,MADdist,HAWdist,LAKdist,MEAdist,MSBdist,PINdist,SEQdist,SMBdist);

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
