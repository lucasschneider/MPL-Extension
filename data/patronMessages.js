/*** CUSTOM PREDEFINED MESSAGES ***/
var msgSelect = document.getElementById('type');

if(msgSelect != null) {
  if (msgSelect.options[4].value === "Special Note") msgSelect.remove(4);
  if (msgSelect.options[1].value === "Internet Authorization") msgSelect.remove(1);

  var cardAtNxtCko = document.createElement('option');
  cardAtNxtCko.value = "Patron must use library card at next checkout. ";
  cardAtNxtCko.innerHTML = "Use card at next CKO";
  msgSelect.insertBefore(cardAtNxtCko,msgSelect.options[1]);
}

/*** Bring 'Session Checkouts' list to top ***/
var yuiG = document.getElementsByClassName('yui-g');
var recentIssues = document.getElementById('recent-issues');
if (yuiG !== undefined && yuiG.length > 0 && recentIssues !== undefined) {
  yuiG[yuiG.length-1].appendChild(recentIssues);
}
