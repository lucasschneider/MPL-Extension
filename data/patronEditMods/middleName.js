(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/
  function parseName() {
    var firstName = document.getElementById('firstname'),
      initials = document.getElementById('initials'),
      names,
      len;
    if (firstName !== null && !/^[ 	]+/.test(firstName.value) && initials !== null) {
    if (firstName !== null && initials !== null && initials.value === '') {
      names = firstName.value.split(' ');
      len = names.length;
      if (len > 1 && names[1]) {
        initials.value = names[1][0];
      } else {
        initials.value = "";
      }
    }
  }

  var firstName = document.getElementById('firstname');
  if (firstName !== null) {
    firstName.addEventListener('blur', parseName);
  }
  }()); //end use strict
