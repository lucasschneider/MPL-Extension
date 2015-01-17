var addNote = document.getElementById('addNote'),
  addr2PSTAT = document.getElementById('addr2PSTAT'),
  QLToggle = document.getElementById('QLToggle'),
  TToggle = document.getElementById('TToggle'),
  quickLinks = document.getElementById('quickLinks'),
  tools = document.getElementById('tools');
if (addNote !== null) {
  addNote.addEventListener('click', function () {
    self.port.emit('addPaymentPlanNote');
  });
}

if (addr2PSTAT !== null) {
  addr2PSTAT.addEventListener('click', function () {
    self.port.emit('addr2PSTAT');
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
