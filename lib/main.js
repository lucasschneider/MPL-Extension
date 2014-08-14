var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");

var button = buttons.ActionButton({
	id: "mozilla-link",
	label: "MPL Extension",
	icon: {
		"16": "./icon-16.png",
		"32": "./icon-32.png",
		"64": "./icon-64.png"
	},
	onClick: handleClick
});

function handleClick(state) {
	tabs.open("http://www.madisonpubliclibrary.org");
}

var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
	include: "*.scls\-staff\.kohalibrary\.com",
	contentScriptFile: data.url("sort-libraries.js")
});
