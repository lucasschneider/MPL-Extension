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

/*** DISABLE RARELY USED FIELDS ***/
var unusedFields = ['streetnumber',
  'address2',
  'select_city',
  'country',
  'mobile',
  'emailpro', // Secondary email address
  'fax',
  'B_country',
  'B_address2',
  'altcontactcountry',
  'altcontactaddress2',
  'sort2',
  'email6', // Item checkout notification
  'email7', // Hold cancelled notification
  'email9', // Item lost notification
  'email5', // Item check-in notification
  // The following are the inputs for old dynix data
  'patron_attr_1',
  'patron_attr_2',
  'patron_attr_3',
  'patron_attr_4',
  'patron_attr_5',
  'patron_attr_6',
  'patron_attr_7',
  'patron_attr_8',
  'patron_attr_9',
  'patron_attr_10',
  'patron_attr_11'],
  parentElt = document.getElementById('entryform');
  sibling = parentElt.children[0];
  enableOptsLabel = document.createElement('label'),
  enableOpts = document.createElement('input'),
  enableOptsContainer = document.createElement('div');

enableOptsLabel.setAttribute('for','enableOpts');
enableOptsLabel.setAttribute('style','display: inline-block; font-weight: bold;');
enableOptsLabel.textContent = 'Enable rarely used input fields:';

enableOpts.id = "enableOpts";
enableOpts.type = 'checkbox';
enableOpts.checked = 'true';
enableOpts.setAttribute('style','margin-left: 20px; display: inline-block;');
enableOpts.addEventListener('click', function () {
  if (this.checked) {
    for (i = 0; i < unusedFields.length; i++) {
      elt = document.getElementById(unusedFields[i]);
      if (elt !== null) {
        elt.disabled = false;
        elt.style.backgroundColor = '';
      }
    }
  } else {
    for (i = 0; i < unusedFields.length; i++) {
      elt = document.getElementById(unusedFields[i]);
      if (elt !== null) {
        elt.disabled = true;
        elt.style.backgroundColor = '#888888';
      }
    }
  }
});

enableOptsContainer.appendChild(enableOptsLabel);
enableOptsContainer.appendChild(enableOpts);
enableOptsContainer.style = "margin-left: 40px;";
parentElt.insertBefore(enableOptsContainer, sibling);

// Trigger event : disable fields
enableOpts.click();
