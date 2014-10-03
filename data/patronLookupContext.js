self.on("click", function () {
  var text = window.getSelection().toString();
  if (document.getElementById('loginform') !== null) self.postMessage('noLogin');
  else self.postMessage(text);
});