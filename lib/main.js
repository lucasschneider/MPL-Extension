/*** IMPORTS ***/
var {ToggleButton} = require('sdk/ui/button/toggle'),
  panels = require("sdk/panel"),
  pageMod = require("sdk/page-mod"),
  perfs = require("sdk/simple-prefs").prefs,
  Request = require("sdk/request").Request;
self = require("sdk/self");
tabs = require("sdk/tabs");

/*** MPL Quick Links Button ***/
var button = ToggleButton({
  id: "mpl-links",
  label: "MPL Quick Links",
  icon: {
    "16": "./" + perfs.skin + "/icon-16.png",
    "32": "./" + perfs.skin + "/icon-32.png",
    "64": "./" + perfs.skin + "/icon-64.png"
  },
  onChange: handleChange
}),
  panel = panels.Panel({
    width: 300,
    height: 320,
    contentURL: self.data.url("mplQuickLinks/panel.html"),
    contentScriptFile: self.data.url("mplQuickLinks/panelScript.js"),
    onHide: handleHide
  });

// Panel listener
panel.port.on("addPaymentPlanNote", function() {
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

/*** Mods to all koha pages ***/
/* BUILT IN FEATURES */
var kohaMods = [self.data.url("sortLibraries.js"), self.data.url("fixSessionCkoDiv.js")];

/* OPTIONAL FEATURES */
if (perfs.patronMsg) kohaMods.push(self.data.url("patronMessages.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha.*/,
  contentScriptFile: kohaMods
});

/*** Mods to memberentry.pl ***/
// Listener for census tract lookup
function startListening(worker) {
  // On query for County Subdivision
  worker.port.on('queryCntySub', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city
    var getCntySub = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=24&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var cntySub = "",
          match = null,
          matchAddr = null;
        
        if (response.json !== undefined && response.json !== null
          && response.json.result !== undefined && response.json.result !== null) {
	        match = response.json.result.addressMatches[0];
        }
        if (match !== undefined && match !== null) {
          var name = match.geographies[ 'County Subdivisions' ][0].NAME;
          matchAddr = match.matchedAddress.split(',')[0].toUpperCase();
          if (name !== null) cntySub = name;
        }
        if (cntySub !== null) worker.port.emit("receivedCntySub", [cntySub,matchAddr]);
      }
    }).get();
  });
  
  worker.port.on('queryZCTA5', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city
    var getCntySub = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=Zip+Code+Tabulation+Areas&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var match = null,
          matchAddr = null,
          zip = null;
        
        if (response.json !== undefined && response.json !== null
          && response.json.result !== undefined && response.json.result !== null) {
	        match = response.json.result.addressMatches[0];
        }
        if (match !== undefined && match !== null) {
          zip = match.geographies[ 'Zip Code Tabulation Areas' ][0].ZCTA5;
          if (zip === null || zip === '') {
			      zip = match[ 'addressComponents' ].zip;
		  	  }
        }
        if (zip !== null) worker.port.emit("receivedZCTA5", zip);
      }
    }).get();
  });
  
  worker.port.on('queryTract', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city
    var getTract = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=14&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var match = null,
		zip = null;
        if (response.json.result !== undefined && response.json.result !== null) match = response.json.result.addressMatches[0];
        var addrTract = [];
        if (match !== undefined && match !== null) {
          // Push address
          if (match.matchedAddress !== null) addrTract.push(match.matchedAddress.split(',')[0].toUpperCase());
          if (match.geographies !== null) {
            // Push tract
            addrTract.push(new String(parseFloat(match.geographies[ 'Census Blocks' ][0].TRACT)/100));
          }
        }
        worker.port.emit("receivedTract", addrTract);
      }
    }).get();
  });
  
  worker.port.on('queryCounty', function(addr) { // addr[0] = URIencodedAddress; addr[1] = city
    var getCounty = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr[0]+"&city="+addr[1]+"&state=wi&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=County&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var county = null,
          match = null;
        if (response.json.result !== undefined && response.json.result !== null) match = response.json.result.addressMatches[0];
        if (match !== null) {
          county = match.geographies[ 'Counties' ][0].BASENAME;
        }
        worker.port.emit("receivedCounty", county);
      }
    }).get();
  });
}

/* BUILT IN FEATURES*/
var patronEditMods = [self.data.url("patronEditMods/standardFormat.js"), self.data.url("patronEditMods/collegeExp.js")];

/* OPTIONAL FEATURES */
if (perfs.validAddr) patronEditMods.push(self.data.url("patronEditMods/validateAddresses.js"));
if (perfs.autoUserId) patronEditMods.push(self.data.url("patronEditMods/autofillUserId.js"));
if (perfs.selectPSTAT) patronEditMods.push(self.data.url("patronEditMods/selectPSTAT.js"));
if (perfs.forceDigest) patronEditMods.push(self.data.url("patronEditMods/forceDigest.js"));
if (perfs.middleName) patronEditMods.push(self.data.url("patronEditMods/middleName.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/,
  contentScriptFile: patronEditMods,
  onAttach: startListening
});
