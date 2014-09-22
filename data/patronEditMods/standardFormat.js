/*** CORRECT TEXT CASE ***/
var inputs = document.querySelectorAll("input[type=text]");
if (inputs !== null) {
  for (var i = 3; i < inputs.length; i++) {
    if (/email|emailpro|B_email/.test(inputs[i].id)) inputs[i].addEventListener('blur', function() {this.value = this.value.toLowerCase().trim().replace(/\s{2,}/g, ' ');});
    else inputs[i].addEventListener('blur', function() {this.value = this.value.toUpperCase().trim().replace(/\s{2,}/g, ' ');});
  }
}

/*** CORRECT CITY FORMAT ***/
var city = document.getElementById('city');
if (city !== null) city.addEventListener('blur', function() {
  if (/madison(,? wi(sconsin)?)?|mad/i.test(this.value)) this.value = "MADISON WI";
});

/*** ALWAYS CHECK HOLD NOTIFICATION ***/
var hold = document.getElementById('email4');
if (hold !== null && hold.checked == false) hold.checked = true;
