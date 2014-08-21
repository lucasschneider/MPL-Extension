var {ActionButton} = require('sdk/ui/button/action');
var panels = require("sdk/panel");
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var perfs = require("sdk/simple-prefs").prefs;

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

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha.*/,
  contentScriptFile: self.data.url("sort-libraries.js")
});

pageMod.PageMod({
  include: /^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/memberentry\.pl.*/,
  contentScriptFile: [//self.data.url("validateAddresses.js"),
                      self.data.url("collegeExpiration.js")]
});
