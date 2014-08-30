/*** CORRECT TEXT CASE ***/
for (var input in document.getElementsByTagName('input')) {
  if (input.type === 'text') {
    if (/email|emailpro|B_email/.test(input.id)) input.addEventListener('blur', function() {this.value.toLowerCase()});
    else input.addEventListener('blur', function() {this.value.toUpperCase()});
  }
}
