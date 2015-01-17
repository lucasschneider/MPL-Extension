var addNote = document.getElementById('addNote'),
  QLToggle = document.getElementById('QLToggle'),
  TToggle = document.getElementById('TToggle'),
  quickLinks = document.getElementById('quickLinks'),
  tools = document.getElementById('tools');
if (addNote !== null) {
  addNote.addEventListener('click', function () {
    self.port.emit('addPaymentPlanNote');
  });
}

if (QLToggle !== null && TToggle !== null && quickLinks !== null && tools !== null) {
  QLToggle.addEventListener('click', function () {
    QLToggle.setAttribute('class', 'tabToggle selected');
    TToggle.setAttribute('class', 'tabToggle');
    quickLinks.style.display = 'block';
    tools.style.display = 'none';
  });
  TToggle.addEventListener('click', function () {
    QLToggle.setAttribute('class', 'tabToggle');
    TToggle.setAttribute('class', 'tabToggle selected');
    quickLinks.style.display = 'none';
    tools.style.display = 'block';
  });
}
