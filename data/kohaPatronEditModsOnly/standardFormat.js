/*** CORRECT TEXT CASE ***/
var inputs = document.querySelectorAll("input[type=text]");
if (inputs !== null) {
  for (var i = 3; i < inputs.length; i++) {
    if (/email|emailpro|B_email/.test(inputs[i].id)) inputs[i].addEventListener('blur', function() {this.value = this.value.toLowerCase().trim().replace(/\s{2,}/g, ' ');});
    else {
      inputs[i].addEventListener('blur', function() {
        this.value = this.value.toUpperCase().replace(/\s{2,}/g, ' ');
        if (/^[ 	]+$/.test(this.value)) {
          this.value = ' ';
        }
	else {
	  this.value = this.value.trim();
        }
      });
    }
  }
}

/*** CORRECT CITY FORMAT ***/
var city = document.getElementById('city'),
  city2 = document.getElementById('B_city'),
  city3 = document.getElementById('altcontactaddress3');

if (city !== null) {
  city.addEventListener('blur', parseMadisonWI);
}

if (city2 !== null) {
  city2.addEventListener('blur', parseMadisonWI);
}

if (city3 !== null) {
  city3.addEventListener('blur', parseMadisonWI);
}

function parseMadisonWI () {
  if (/madison(,? wi(sconsin)?)?|mad/i.test(this.value)) this.value = "MADISON WI";
  this.value = this.value.replace(/,/,'');
}

/*** ALWAYS CHECK HOLD NOTIFICATION ***/
/*** This should be rewritten to only check the hold notification
 * option for new juvenile accounts */
//var hold = document.getElementById('email4');
//if (hold !== null && hold.checked == false) hold.checked = true;
