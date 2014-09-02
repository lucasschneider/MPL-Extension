/*** PRESELECTED P-STAT ***/
var city = document.getElementById('city');
if (city !== null) {
  city.addEventListener('blur', function() {
    var cityRegEx = /madison(,? wi(sconsin)?)?/i;
    if (cityRegEx.test(document.getElementById('city').value)) {
      entryForm = document.forms.entryform;
      if (entryForm !== null) {
        var pstat = entryForm.elements.sort1;
        if (pstat !== null) {
          var selectedIdx = 0;
          for (var i = 0; i < pstat.length; i++) {
            if (pstat.children[i].value === "D-X-MAD") {
              selectedIdx = i;
              break;
            }
          }
          if (pstat[pstat.selectedIndex].value === "") pstat.selectedIndex = selectedIdx;
        }
      }
    }
  });
}

// data.gov APi key: D33VBB3tXzQ3FWlqJ7urcVf8rRvwswKU5wonQkXH
