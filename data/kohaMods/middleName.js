(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/
  function parseName() {
    var initials = document.getElementById('initials'),
      names,
      len;
    this.value = this.value.replace(/[\.,]/gi, '');
    if (!/^[ 	]+/.test(this.value) && initials) {
      names = this.value.split(' ');
      len = names.length;
      if (len > 1 && names[1] && /[A-Za-z]/.test(names[1][0])) {
        initials.value = names[1][0].toUpperCase();
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
