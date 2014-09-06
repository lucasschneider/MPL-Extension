function queryCensusTract() {
  var city = document.getElementById('city');
  var entryForm = document.forms.entryform;
  var selectList = (entryForm !== null) ? entryForm.elements.sort1 : null;
  var notice = document.getElementById('tractNotice');
  var result = document.createElement('div');

  if (addr.value !== "" && city.value !== "" && zip !== null && selectList !== null) {
    var cityRegEx = /madison(,? wi(sconsin)?)?/i;
    if (cityRegEx.test(document.getElementById('city').value)) {
      // Generate loading message
      notice.innerHTML = "Searching for census tract and zipcode... ";
      result.innerHTML = '';
      notice.appendChild(result);

      // Default to MAD UND if tract is empty
      if (selectList[selectList.selectedIndex] === "") selectXMAD(selectList);
      self.port.emit("queryTract", addr.value.replace(" ","+"));
      self.port.on("receivedTract", function (addrTract) {
        if (addrTract !== null && addrTract.length === 3) {
          addr.value = addrTract[0];
	  zip.value = addrTract[1];

          var selected = false;
          for (var i = 0; i < selectList.length; i++) {
            if (selectList.children[i].value === "D-"+addrTract[2]) {
              selectList.selectedIndex = i;
	      result.setAttribute('style','display:inline-block;color:#00c000;');
	      result.innerHTML = '[SUCCESS]';
              selected = true;
              break;
            }
          }
          if (!selected) selectXMAD(selectList);
        }
	else {
	  result.setAttribute('style','display:inline-block');
	  result.innerHTML = '[FAILED: please enter zipcode and<br />census tract manually.]';
	}
      });
    }
  }
}

addr = document.getElementById('address');
if (addr !== null) {
  addr.addEventListener('blur', queryCensusTract);
  var notice = document.createElement('div');
  notice.id = 'tractNotice';
  notice.setAttribute('style','margin-top:.2em;margin-left:118px;font-style:italic;color:#c00;');
  addr.parentElement.appendChild(notice);
}
city = document.getElementById('city');
if (city !== null) city.addEventListener('blur', queryCensusTract);

// Select D-X-MAD form PSTAT select list
function selectXMAD(selectList) {
  if (selectList !== null) {
    var madUndIdx = 235; /* D-X-MAD index as of 9/5/2014 */
    if (selectList.children[madUndIdx].value === "D-X-MAD") {
      selectList.selectedIndex = madUndIdx;
    }
    else {
      for (var i = 0; i < pstat.length; i++) {
        if (selectList.children[i].value === "D-X-MAD") {
          selectList.selectedIndex = i;
          break;
        }
      }
      selectList.selectedIndex = i;
    }
  }
}

