/*** IMPORTS ***/
var {ActionButton} = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
self = require("sdk/self");
var perfs = require("sdk/simple-prefs").prefs;
var Request = require("sdk/request").Request;

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
var circMods = [self.data.url("sortLibraries.js")];

/* OPTIONAL FEATURES */
if (perfs.patronMsg) circMods.push(self.data.url("patronMessages.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha.*/,
  contentScriptFile: circMods
});

/*** Mods to memberentry.pl ***/
// Parse string for JSON data
function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Listener for census tract lookup
function startListening(worker) {
  worker.port.on('queryTract', function(addr) {
    var getTract = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street="+addr+"&city=Madison&state=WI&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=14&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var match = (isJSON(response)) ? response.json.result.addressMatches[0] : undefined;
	var addrTract = [];
        if (match !== undefined) {
	  // Push address
          if(match.matchedAddress !== null) addrTract.push(match.matchedAddress.split(",").splice(0,1).join("").toUpperCase());
	  // Push zip
          if (match[ 'addressComponents' ] !== null) addrTract.push(match[ 'addressComponents' ].zip);
	  // Push tract
          if (match.geographies !== null) addrTract.push(new String(parseFloat(match.geographies[ 'Census Blocks' ][0].TRACT)/100));
	}
        worker.port.emit("receivedTract", addrTract);
      }
    }).get();
    if (!getTract) worker.port.emit("receivedTract",[]);
  });
}

/* BUILT IN FEATURES*/
var patronEditMods = [self.data.url("patronEditMods/standardFormat.js"), self.data.url("patronEditMods/collegeExp.js")];

/* OPTIONAL FEATURES */
if (perfs.validAddr) patronEditMods.push(self.data.url("patronEditMods/validateAddresses.js"));
if (perfs.autoUserId) patronEditMods.push(self.data.url("patronEditMods/autofillUserId.js"));
if (perfs.selectTract) patronEditMods.push(self.data.url("patronEditMods/selectTract.js"));
if (perfs.forceDigest) patronEditMods.push(self.data.url("patronEditMods/forceDigest.js"));
if (perfs.middleName) patronEditMods.push(self.data.url("patronEditMods/middleName.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/,
  contentScriptFile: patronEditMods,
  onAttach: startListening
});
