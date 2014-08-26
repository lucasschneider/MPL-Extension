var email = document.getElementById('email');
if (email != null) email.onblur = function() {
  var email = this;
  email.value = email.value.toLowerCase();
}
