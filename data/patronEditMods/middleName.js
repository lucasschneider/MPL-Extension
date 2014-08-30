function parseName() {
  var firstName = document.getElementById('firstname');
  if (firstName !== null) {
    var names = firstName.split(' ');
    names.splice(0,1);
    for (var n in names) {
    }
  }
}

var firstName = document.getElementById('firstname');
if (firstName !== null) firstName.addEventListener('blur', parseName);
