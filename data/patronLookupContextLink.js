 self.on("click", function (node, data) {
  if (/^https?\:\/\/scls-staff\.kohalibrary\.com\/cgi-bin\/koha\/members\/moremember.pl\?borrowernumber=[0-9]*/.test(node)) {
    self.postMessage(node);
  }
  else self.postMessage('notPatron');
});