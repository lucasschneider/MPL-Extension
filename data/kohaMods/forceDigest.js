/*
 * email: HTML checkbox input element which sends
 *   patron email notification
 * digest: nottification's checkbox input option to
 *   send digests only
 */
function forceDigest(email, digest) {
  if (email !== null && digest !== null) {
    if (email.checked) digest.checked = true;
    else digest.checked = false;
  }
}

function advanceNotice(email) {
  var notice = document.getElementsByName('2-DAYS');
  if (notice !== null) notice = notice[0];
  if (notice !== null && email2 !== null && email2.checked) notice.children[2].selected = true;
  else if (notice !== null) notice.children[0].selected = true;
}

if (email1 !== null && digest1 !== null && email2 !== null && digest2 !== null) {
  email1.addEventListener('click', function() {forceDigest(email1,digest1);});
  email2.addEventListener('click', function() {forceDigest(email2,digest2); advanceNotice(email2);});
}
