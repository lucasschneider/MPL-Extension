/*** SELECT P-STAT ***/
function selectPSTAT(censusTract) {
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
}
var city = document.getElementById('city');
if (city !== null) {
  city.addEventListener('blur', function() {
    var cityRegEx = /madison(,? wi(sconsin)?)?/i;
    if (cityRegEx.test(document.getElementById('city').value)) {

    }
  });
}

var url = 'http://geocoding.geo.census.gov/geocoder/geographies/address?street=201+W+Mifflin+St&city=Madison&state=WI&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=14&format=jsonp';

$.ajax({
  type: 'GET',
  url: url,
  async: false,
  jsonpCallback: 'jsonCallback',
  contentType: "application/json",
  dataType: 'jsonp',
  success: function(json) {
    selectPSTAT(String(parseFloat(json.result.addressMatches[0].geographies[ 'Census Blocks' ][0].TRACT/100)));
  },
  error: function(e) {
    selectPSTAT("X-MAD");
  }
});
