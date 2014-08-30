function parseName() {
  var firstName = document.getElementById('firstname');
  var initials = document.getElementById('initials');
  if (firstName !== null && initials !== null) {
    var names = firstName.value.split(' ');
    var len = names.length;
    if (len > 1) initials.value = names[1][0];
    else initials.value = " ";
    if (len > 2) {
      initials.value += " "
      for (var i = 2; i < len; i++) {
        if (i === len - 1) initials.value += names[i][0];
        else initials.value += names[i][0] + " ";
      }
    }
  }
}

var firstName = document.getElementById('firstname');
if (firstName !== null) firstName.addEventListener('blur', parseName);
