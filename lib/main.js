/*** IMPORTS ***/
var {ActionButton} = require('sdk/ui/button/action'),
  pageMod = require("sdk/page-mod"),
  perfs = require("sdk/simple-prefs").prefs,
  contextMenu = require("sdk/context-menu"),
  notifications = require("sdk/notifications"),
  Request = require("sdk/request").Request;
timer = require('sdk/timers');
self = require("sdk/self");
tabs = require("sdk/tabs");

/*** ACTION BUTTON ***/
var button = ActionButton({
  id: "mpl-link",
  label: "MPL Koha Patch",
  icon: {
    "16": "./" + perfs.skin + "/icon-16.png",
    "32": "./" + perfs.skin + "/icon-32.png",
    "64": "./" + perfs.skin + "/icon-64.png"
  },
  onClick: handleClick
});

/*** GET PATRON INFO ***/
// For highlighted barcode
/*var barcodeSelect = contextMenu.Item({
  label: "Lookup Patron",
  context: contextMenu.SelectionContext(),
  contentScriptFile: self.data.url("patronLookupContext.js"),
  onMessage: function (selectionText) {
    if (selectionText === 'noLogin') {
      notifications.notify({
        title: "Patron Lookup Error",
        text: "You must be logged in to lookup patron information",
        iconURL: self.data.url(perfs.skin + "/icon-16.png")
      });
    }
  }
});

// For link to patron record
var patronSelect = contextMenu.Item({
  label: "Lookup Patron",
  context: contextMenu.SelectorContext("a[href]"),
  contentScriptFile: self.data.url("patronLookupContextLink.js"),
  onMessage: function (patronInfoLink) {
    if (patronInfoLink === 'notPatron') {
      notifications.notify({
        title: "Patron Lookup Error",
        text: "Your selection does not link to a patron record.",
        iconURL: self.data.url(perfs.skin + "/icon-16.png")
      });
    }
    else {
      patronWorker = require("sdk/page-worker").Page({
        contentScript: "alert(document.getElementById('breadcrumbs').innerHTML);",
        contentScriptWhen: "ready",
        contentURL: patronInfoLink.toString()
      });
    }
  }
});*/

function handleClick(state) {
  switch(perfs.skin) {
    case "MPL":
      tabs.open("http://www.madisonpubliclibrary.org");
      break;
    case "MID":
      tabs.open("http://www.midlibrary.org");
      break;
    case "SCLS":
      tabs.open("http://www.scls.info");
      break;
  }
}

/*** Mods to circulation.pl ***/
/* BUILT IN FEATURES */
var circMods = [self.data.url("sortLibraries.js"), self.data.url("fixSessionCkoDiv.js")];

/* OPTIONAL FEATURES */
if (perfs.patronMsg) circMods.push(self.data.url("patronMessages.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha.*/,
  contentScriptFile: circMods
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
