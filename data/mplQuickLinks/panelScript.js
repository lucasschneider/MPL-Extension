var addNote = document.getElementById('addNote');
if (addNote !== null) {
  addNote.addEventListener('click', function () {
    self.port.emit('addPaymentPlanNote');
  });
}
