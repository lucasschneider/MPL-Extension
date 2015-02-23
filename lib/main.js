/*** IMPORTS ***/
var { ActionButton } = require("sdk/ui/button/action"),
  {ToggleButton} = require('sdk/ui/button/toggle'),
  panels = require("sdk/panel"),
  pageMod = require("sdk/page-mod"),
  perfs = require("sdk/simple-prefs").prefs,
  Request = require("sdk/request").Request,
  button;
self = require("sdk/self");
tabs = require("sdk/tabs");

/*** MPL Quick Links Button ***/
if (perfs.skin === "MPL") {
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
} else if (perfs.skin === "MID") {
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
    contentScriptFile: self.data.url('mplQuickLinks/contentScript.js')
  });
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

function PSTATListener(worker) {
  // On geocoder query
  worker.port.on('queryGeocoder', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city
    var getCntySub = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Current&vintage=Current_Current&layers=Counties,Census Tracts,County+Subdivisions&format=json",
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
  });

  panel.port.on("addr2PSTAT", function () {
    panel.hide();
    if (/^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/.test(tabs.activeTab.url)) {
      tabs.activeTab.attach({
        contentScript: "x=document.createElement('span');x.id='querySecondaryPSTAT';x.style.display='none';document.body.appendChild(x);"
      });
      worker.port.emit('querySecondaryPSTAT');
    } else {
      tabs.activeTab.attach({
        contentScript: "x=document.createElement('span');x.id='querySecondaryPSTATFail';x.style.display='none';document.body.appendChild(x);"
      });
      worker.port.emit('querySecondaryPSTATFail');
    }
  });
}

/* BUILT IN FEATURES*/
var kohaMods = [
  self.data.url("kohaMods/sortLibraries.js"),
  self.data.url("kohaMods/fixSessionCkoDiv.js"),
  self.data.url("kohaMods/collegeExp.js")
];

var kohaPatronEditMods = [
  self.data.url("kohaPatronEditModsOnly/standardFormat.js")
];

/* OPTIONAL FEATURES */
// KohaMods
if (perfs.patronMsg) kohaMods.push(self.data.url("kohaMods/patronMessages.js"));
if (perfs.validAddr) kohaMods.push(self.data.url("kohaMods/validateAddresses.js"));
if (perfs.autoUserId) kohaMods.push(self.data.url("kohaMods/autofillUserId.js"));
if (perfs.selectPSTAT) kohaMods.push(self.data.url("kohaMods/selectPSTAT.js"));
if (perfs.middleName) kohaMods.push(self.data.url("kohaMods/middleName.js"));

// KohaPatronEditMods
if (perfs.forceDigest) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/forceDigest.js"));
if (perfs.restrictNotificationOptions) kohaPatronEditMods.push(self.data.url("kohaPatronEditModsOnly/restrictNotificationOptions.js"));


pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com.*/,
  contentScriptFile: kohaMods,
  onAttach: PSTATListener
});

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry.pl.*/,
  contentScriptFile: kohaPatronEditMods,
  onAttach: PSTATListener
});
