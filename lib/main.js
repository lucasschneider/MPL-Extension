/*** IMPORTS ***/
var {ActionButton} = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
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
/* BUILT IN */
var circMods = [self.data.url("sortLibraries.js")];

/* OPTIONAL */
if (perfs.patronMsg) circMods.push(self.data.url("patronMessages.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha.*/,
  contentScriptFile: circMods
});

/*** Mods to memberentry.pl ***/
/* BUILT IN */
var patronEditMods = [self.data.url("patronEditMods/standardFormat.js")];

/* OPTIONAL */
if (perfs.validAddr) patronEditMods.push(self.data.url("patronEditMods/validateAddresses.js"));
if (perfs.collegeExp) patronEditMods.push(self.data.url("patronEditMods/collegeExp.js"));
if (perfs.autoUserId) patronEditMods.push(self.data.url("patronEditMods/autofillUserId.js"));
if (perfs.preselectPstat) patronEditMods.push(self.data.url("patronEditMods/preselectMADPstat.js"));
if (perfs.forceDigest) patronEditMods.push(self.data.url("patronEditMods/forceDigest.js"));
if (perfs.middleName) patronEditMods.push(self.data.url("patronEditMods/middleName.js"));

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/,
  contentScriptFile: patronEditMods,
  onAttach: startListening
});

function startListening(worker) {
  worker.port.on('queryTract', function(query) {
    var getTract = Request({
      url: "http://geocoding.geo.census.gov/geocoder/geographies/address?street=201+W+Mifflin+St&city=Madison&state=WI&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=14&format=json",
      overrideMimeType: "application/json; charset=UTF-8",
      onComplete: function (response) {
        var match = response.json.result.addressMatches[0];
        if (match !== undefined) {
          var address = match.matchedAddress.split(",").splice(0,1).join("");
          var zip = match[ 'addressComponents' ].zip;
          var tract = new String(parseFloat(match.geographies[ 'Census Blocks' ][0].TRACT)/100);
          console.log(tract)
	}
      }
    });
  });
}
