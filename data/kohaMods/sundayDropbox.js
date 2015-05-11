(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/
  function sundayDropbox() {
    if (!this.checked) {
      self.port.emit("disableSundayDropbox");
      alert('Automatic selection of dropbox mode disabled. To automatically select "Dropbox Mode" on Sundays enter about:addons into the address bar and edit the preferences for the MPL Koha Patch.');
    }
  }
  var dropbox = document.getElementById('dropboxcheck');
  if (dropbox !== null) {
    dropbox.addEventListener('click', sundayDropbox);
    dropbox.checked = true;
  }
}()); //end use strict
