function parseName() {
  var firstName = document.getElementById('firstname');
  var initials = document.getElementById('initials');
  if (firstName !== null && initials !== null) {
    firstName.value = firstName.value;
    var names = firstName.value.split(' ');
    var len = names.length;
    if (len > 1) initials.value = names[1][0];
    else initials.value = "";
  }
}

var firstName = document.getElementById('firstname');
if (firstName !== null) firstName.addEventListener('blur', parseName);
