/*** CHECK AGAINST LIST OF UNACCEPTABLE
     AND RESTRICTED ADDRESSES ***/
function restoreSave() {
  var field = document.getElementsByClassName('action')[0];
  if (field !== null && field.childElementCount === 3) {
    field.replaceChild(field.children[2],field.children[0]);
    field.children[0].style="cursor:pointer;";
    return false;
  }
  else {
    alert("Unable to save. Please refresh the page.");
    return false;
  }
}

function blockSubmit() {
  var field = document.getElementsByClassName('action')[0];
  var save = document.getElementsByName('save')[0];
  if (field !== null && save !== null) {
    var button = document.createElement('input');
    button.type='button';
    button.value='Override Block';
    button.style='cursor:pointer;';
    button.addEventListener('click', restoreSave);
    field.appendChild(button);
    field.appendChild(field.children[1]);
    field.appendChild(field.children[0]);
    field.children[2].style="display:none;";
    return false;
  }
}

function parseBadAddr() {
  var addr = document.getElementById('address');
  var addr2 = document.getElementById('address2');
  var city = document.getElementById('city');
  var cityRegEx = /madison([,]? wi.*)?/i;
  if (addr !== null && city !== null && cityRegEx.test(city.value)) {
    var unacceptableRegEx = /[ ]*1819 aberg.*|[ ]*1317 applegate.*|[ ]*4581 (w|west) beltline.*|[ ]*147 (s|south) butler st.*|[ ]*115 (w|west) doty.*|[ ]*4230 (e|east) towne.*|[ ]*6441 enterprise.*|[ ]*2935 fish ?hatchery.*|[ ]*(802 (e|east)|408 (w|west)) gorham.*|[ ]*210 martin luther king.*|[ ]*3902 milwaukee.*|[ ]*4514 monona.*|[ ]*12(02|06) northport.*|[ ]*6666 odana.*|[ ]*12(28|40) (s|south) park.*|[ ]*1360 regent.*|[ ]*2120 rimrock.*|[ ]*3150 st paul.*|[ ]*103 (s|south) (2nd|second).*|[ ]*1213 (n|north) sherman.*|[ ]*731 state.*|[ ]*2701 university.*|[ ]*((322|512|1245) (e|east)|(116|625|668) (w|west)) washington.*/i;
    var restrictedRegEx = /[ ]*1955 atwood.*|[ ]*221 (s|south) baldwin.*|[ ]*306 (n|north) brooks.*|[ ]*2009 (e|east) dayton.*|[ ]*4117 dwight.*|[ ]*300 femrite.*|[ ]*4 (n|north) hancock.*|[ ]*3501 kipling.*|[ ]*4202 monona.*|[ ]*4006 nakoosa.*|[ ]*422 (n|north).*|[ ]*5706 odana.*|[ ]*202 (n|north) pat?terson.*|[ ]*1301 (williamson|willy).*/i;
    var martinStRegEx = /[ ]*1490 martin.*/i;
    var salvationRegEx = /[ ]*630 (e|east) washington.*/i;
    var addrVal = addr2 != null && (addr2.value !== null && addr2.value !== "") ? addr.value + ", " + addr2.value : addr.value;
    if (unacceptableRegEx.test(addrVal)) {
      alert("--- STOP ---\nA library card CANNOT be issued to this address.\n" + addrVal.toUpperCase() + " is NOT a valid residential address.\n\nInform any patron providing one of these addresses that they must provide proof of a valid residential address in order to get a library card. (You could offer them an internet access card.)\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
      blockSubmit();
    }
    else if (restrictedRegEx.test(addrVal)) {
      alert("--- NOTE ---\nA library card issued to " + addrVal.toUpperCase() + " must be LIMITED USE.\n\nIn order to have the limited use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else if (martinStRegEx.test(addrVal)) {
      alert("--- NOTE ---\n1490 MARTIN ST is the Hospitality House, a daytime resource center for homeless and low-income people in Dane County. A LIMITED USE account may be set up, however, all library cards issued to that address MUST be mailed, whether or not the patron provides proof of that address.\n\nIn order to have the Limited Use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else if (salvationRegEx.test(addrVal)) {
      alert("--- NOTE ---\n630 E WASHINGTON AVE is the Salvation Army. People staying at the Salvation Army cannot receive personal mail there so library cards CANNOT BE MAILED. Patrons must have proof that they are staying at the Salvation Army to get a library card (usually through a letter from the director).\n\nIn order to have the Limited Use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else {
      var field = document.getElementsByClassName('action')[0];
      if (field != null && field.children[0].value === 'Override Block') restoreSave();
    }
  }
}

var addr = document.getElementById('address');
if (addr !== null) addr.addEventListener('blur',parseBadAddr);
var city = document.getElementById('city');
if (city !== null) city.addEventListener('blur',parseBadAddr);
