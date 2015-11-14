(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/

  function printBarcode() {
     self.port.emit("printBarcode",document.getElementsByClassName('patroninfo')[0].children[0].innerHTML.replace(/\D/g,''));
  }

  var toolbar = document.getElementsByClassName('toolbar')[0],
  li,
  button;
  
  if (toolbar) {
    li = document.createElement('li');
    button = document.createElement('button');
    button.onclick = printBarcode;
    button.innerHTML = "Print Barcode";

    li.appendChild(button);
    toolbar.appendChild(li);
  }

}()); //end use strict