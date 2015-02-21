/*** CUSTOM PREDEFINED MESSAGES ***/
var msgSelect = document.getElementById('type');

if(msgSelect != null) {
  if (msgSelect.options[4].value === "Special Note") {
    msgSelect.remove(4);
  }

  var cardAtNxtCko = document.createElement('option');
  cardAtNxtCko.value = "Patron must have library card at next checkout. ";
  cardAtNxtCko.innerHTML = "Have card at next CKO";
  msgSelect.insertBefore(cardAtNxtCko,msgSelect.options[1]);
  
  var addNotesLabel = document.createElement('label');
  addNotesLabel.setAttribute('for','addNotes');
  addNotesLabel.setAttribute('style','display: inline-block;');
  addNotesLabel.innerHTML = 'Include notes for returned mail and bad emails:';

  var addNotes = document.createElement('input');
  addNotes.id = "addNotes";
  addNotes.type = 'checkbox';
  addNotes.setAttribute('style','margin-left: 20px; display: inline-block;');
  addNotes.addEventListener('click', function () {
    if (this.checked) {
      returnedMailGroup.setAttribute('style','display: initial;');
      badEmailGroup.setAttribute('style','display: initial;');
    }
    else {
      returnedMailGroup.setAttribute('style','display: none;');
      badEmailGroup.setAttribute('style','display: none;');
    }
  });

  var addNotesContainer = document.createElement('li');
  addNotesContainer.appendChild(addNotesLabel);
  addNotesContainer.appendChild(addNotes);
  msgSelect.parentElement.parentElement.insertBefore(addNotesContainer,msgSelect.parentElement.parentElement.children[2]);

  var returnedMailGroup = document.createElement('optgroup');
  returnedMailGroup.label = 'Returned Mail';
  returnedMailGroup.style.display="";
  msgSelect.appendChild(returnedMailGroup);

  var poRtd = document.createElement('option');
  poRtd.value = "Mail returned by PO. Holds, if any, are suspended and notices are deactivated";
  poRtd.innerHTML = "Mail returned by post office";
  returnedMailGroup.appendChild(poRtd);

  var cardRtd = document.createElement('option');
  cardRtd.value = "Card was mailed to patron to establish proof of address, but was ret'd by PO. Card is now at MAD. When patron provides new address, please contact MAD-CIRC so card can be mailed again. ";
  cardRtd.innerHTML = "Library card returned by post office";
  returnedMailGroup.appendChild(cardRtd);

  var badEmailGroup = document.createElement('optgroup');
  badEmailGroup.label = 'Bad Email Address';
  badEmailGroup.style.display="";
  msgSelect.appendChild(badEmailGroup);

  var badEmail = document.createElement('option');
  badEmail.value = "Email address not recognized, unable to send notices. Verify that mailing address and phone are correct. Enter new email address. Holds, if any, are suspended. Previous email was: ";
  badEmail.innerHTML =  "Email address not recognized";
  badEmailGroup.appendChild(badEmail);

  var fullEmail = document.createElement('option');
  fullEmail.value = "Email box is full; unable to send notices by email. Holds, if any, are suspended. Email was: ";
  fullEmail.innerHTML =  "Email box is full";
  badEmailGroup.appendChild(fullEmail);
}
