alert("validateAddresses!");
if (window.location.pathname === "/cgi-bin/koha/members/memberentry.pl") {
  var tabs = require("sdk/tabs");
  alert("You're editing a patron record!");
  tabs.activeTab.attach({
    contentScriptFile: data.url("jquery-2.1.1.min.js")
  });

  /* ADDRESS DATA TYPE */
  var Address = function(streetNum,prefix,name,suffix,des,note,t) {
    this.streetNum = streetnum;
    this.prefix = prefix;
    this.name = name;
    this.suffix = suffix;
    this.des = des;
    this.note = note
    this.t = t;

    this.getStreetNum = function() { return streetNum; };
    this.getPrefix = function() { return prefix; };
    this.getName = function() { return name; };
    this.getSuffix = function() { return suffix; };
    this.getDes = function() { return this.des; };
    this.getNote = function() { return this.note; };
    this.getT = function() { return this.t; };

    this.print = function() {
      alert(streetNum + " " + prefix + " " + name + " " + suffix);
      alert(des + " : " + note);
      alert("type: " + t);
    }
  }
}
