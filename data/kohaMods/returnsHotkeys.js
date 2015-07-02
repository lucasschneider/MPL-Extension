(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  // Control-[left arrow] to print slip, otherwise confirm
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 32 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      var printSlip = document.getElementsByClassName("print"),
        confirm = document.getElementsByClassName("approve");
      if (printSlip.length > 0) {
        printSlip = printSlip[0];
        if (printSlip) {
          printSlip.click();
        }
      // Control-[left arrow] to confirm if print slip isn't an option
      } else if (confirm.length > 0 && printSlip.length == 0) {
        confirm = confirm[0];
        if (confirm) {
          confirm.click();
        }
      }
    }
  }, false);
  
  // Escape to only confirm hold
  document.addEventListener("keydown", function(e) {
    if (e.keyCode == 27) {
      e.preventDefault();
      var confirm = document.getElementsByClassName("approve"),
        deny = document.getElementsByClassName("deny");
      if (confirm.length > 0 && deny.length === 0) {
        confirm[0].click();
      // Escape to "ignore and keep item here"
      } else if (confirm.length == 0 && deny.length > 0) {
        deny[0].click();
      }
    }
  }, false);
}()); //end use strict