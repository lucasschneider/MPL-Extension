var addNote = document.getElementById('addNote'),
  addLostNote = document.getElementById('addLostNote'),
  addr2PSTAT = document.getElementById('addr2PSTAT'),
  calendarAnnouncements = document.getElementById('calendarAnnouncements'),
  QLToggle = document.getElementById('QLToggle'),
  TToggle = document.getElementById('TToggle'),
  quickLinks = document.getElementById('quickLinks'),
  tools = document.getElementById('tools');
if (addNote) {
  addNote.addEventListener('click', function () {
    self.port.emit('addPaymentPlanNote');
  });
}

if (addLostNote) {
  addLostNote.addEventListener('click', function () {
    self.port.emit('addLostCardNote');
  });
}

if (addr2PSTAT) {
  addr2PSTAT.addEventListener('click', function () {
    self.port.emit('addr2PSTAT');
  });
}

if (calendarAnnouncements) {
  calendarAnnouncements.addEventListener('click', function () {
    self.port.emit('calendarAnnouncements');
  });
}

if (QLToggle && TToggle && quickLinks && tools) {
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
