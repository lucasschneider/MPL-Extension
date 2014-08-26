/*** PRESELECTED P-STAT ***/
if (document.forms.entryform != null) {
  var pstat = document.forms.entryform.elements.sort1;
  if (pstat != null) {
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
