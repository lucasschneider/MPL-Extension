var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var perfs = require("sdk/simple-prefs").prefs;
console.log(perfs.flavor);

var button = buttons.ActionButton({
	id: "mpl-link",
	label: "MPL Koha Patch",
	icon: {
		"16": "./" + perfs.flavor + "/icon-16.png",
		"32": "./" + perfs.flavor + "/icon-32.png",
		"64": "./" + perfs.flavor + "/icon-64.png"
	},
	onClick: handleClick
});

function handleClick(state) {
	switch(perfs.flavor) {
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

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: "*.scls\-staff\.kohalibrary\.com",
	contentScriptFile: [data.url("sort-libraries.js"),
			    data.url("validateAddresses.js")]
});
