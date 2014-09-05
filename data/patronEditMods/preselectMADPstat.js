var city = document.getElementById('city');
if (city !== null) {
  city.addEventListener('blur', function() {
    var cityRegEx = /madison(,? wi(sconsin)?)?/i;
    if (cityRegEx.test(document.getElementById('city').value)) {
      self.port.on("receivedTract", function (censusTract) {
        entryForm = document.forms.entryform;
        if (entryForm !== null) {
          var pstat = entryForm.elements.sort1;
          if (pstat !== null) {
            var selectedIdx = 0;
            var madUndIdx = 235;
            for (var i = 0; i < pstat.length; i++) {
              if (pstat.children[i].value === "D-"+censusTract) {
                selectedIdx = i;
                break;
              }
            }
            if (pstat[pstat.selectedIndex].value === "") {
              if (pstat[madUndIdx].value !== "D-X-MAD" && selectedIdx === 0) {
                for (var i = 0; i < pstat.length; i++) {
                  if (pstat.children[i].value === "D-X-MAD") {
                    pstat.selectedIndex = i;
                    break;
              }
            }
              }
              else if (selectedIdx === 0) {
                pstat.selectedIndex = madUndIdx;
              }
              else {
                pstat.selectedIndex = selectedIdx;
              }
            }
          }
        }
      });
      self.port.emit("queryTract","");
    }
  });
}
