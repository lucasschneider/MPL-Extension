/*
 * email: HTML checkbox input element which sends
 *   patron email notification
 * digest:    nottification's checkbox input option to
 *   send digests only
 */
function forceDigest(email, digest) {
  if (email !== null && digest !== null) {
    if (email.checked) digest.checked = true;
    else digest.checked = false;
  }
}

var email1 = document.getElementById('email1');
var digest1 = document.getElementById('digest1');
var email2 = document.getElementById('email1');
var digest2 = document.getElementById('digest1');

if (email1 !== null && digest1 !== null) email1.addEventListener('click', function() {forceDigest(email1,digest1)});
if (email2 !== null && digest2 !== null) email2.addEventListener('click', function() {forceDigest(email2,digest2)});
