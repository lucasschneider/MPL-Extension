/*** CHECK AGAINST LIST OF UNACCEPTABLE
     AND RESTRICTED ADDRESSES ***/
function restoreSave() {
  var s = document.getElementsByName('save')[0];
  if (s !== null) {
    s.value='Save';
    s.type='submit';
    return false;
  }
}

function blockSubmit() {
  var s = document.getElementsByName('save')[0];
  if (s !== null) {
    s.type='button';
    s.value='Override Block';
    s.addEventListener('click',function() {
      restoreSave();
    });
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
      alert("--- STOP ---\nA library card MUST NOT be issued to this address.\n" + addrVal.toUpperCase() + " is NOT a valid residential address.\n\nInform any patron providing one of these addresses that they must provide proof of a valid residential address in order to get a library card. (You could offer them an internet access card.)\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
      blockSubmit();
    }
    else if (restrictedRegEx.test(addrVal)) {
      alert("--- NOTE ---\nA library card issued to " + addrVal.toUpperCase() + " must be LIMITED USE.\n\nIn order to have the limited use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else if (martinStRegEx.test(addrVal)) {
      alert("--- NOTE ---\n1490 MARTIN ST is the Hospitality House, a daytime resource center for homeless and low-income people in Dane County. A LIMITED USE account may be set up, however, all library cards issued to that address MUST be mailed, whether or not the patron provides proof of that address.\n\nIn order to have the Limited Use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else if (salvationRegEx.test(addrVal)) {
      alert("--- NOTE ---\n630 E WASHINGTON AVE is the Salvation Army. People staying at the Salvation Army cannot receive personal mail there so library cards CANNOT BE MAILED. Patrons must have proof that they are staying at the Salvation Army to get a library card.\n\nIn order to have the Limited Use restrictions removed from their account, a patron must first provide proof that they are living at a valid residential address.\n\nFor more info refer to the list of unacceptable addresses on the staff wiki:\nhttp://mplnet.pbworks.com/w/file/fetch/79700849/UNACCEPTABLE%20ADDRESSES.pdf");
    }
    else {
      var s = document.getElementsByName('save')[0];
      if (s != null && s.value !== 'Override Block') restoreSave();
    }
  }
}

/*** CHECK FOR COLLEGE DORM ADDRESSES
     AND SET EXP DATE IF NECESSARY ***/
function parseAddress() {
  var addr = document.getElementById('address');
  var addr2 = document.getElementById('address2');
  var zip = document.getElementById('zipcode');
  
  if (zip != null && addr != null) {
    addrRegEx = /.*15(10|20) tripp.*|.*970 university.*|.*(625|635|640|650) elm.*|.*(35|420).{0,7}park.*|.*1200 observatory.*|.*16(35|50) kronshage.*|.*(835|917|919|921).{0,6}dayton.*|.*1950 willow.*|.*(615|821|917).{0,6}johnson.*|.*625 babcock.*/i;
    zipRegEx = /53706(\-[0-9]{4})?|53715(\-[0-9]{4})?/;
    var addressVal = addr2 != null ? addr.value + " " + addr2.value : addr.value;
    
    if (zipRegEx.test(zip.value) && addrRegEx.test(addressVal)) {
      date = new Date();
      switch(parseInt(date.getUTCMonth())) {
      case 0:
      case 1:
      case 2:
     case 3:
        year = date.getUTCFullYear();
        break;
      case 4:
        if (parseInt(date.getUTCDate()) < 15)
          year = date.getUTCFullYear();
        break;
      default:
        year = (parseInt(date.getUTCFullYear())+1).toString();
      }
      document.getElementById('dateexpiry').value = "05/15/" + year;
    }
  }
}

var addr = document.getElementById('address');
if (addr !== null) addr.onblur = function() {parseBadAddr(); parseAddress();};
var city = document.getElementById('city');
if (city !== null) city.onblur = function() {parseBadAddr();};
var zip = document.getElementById('zipcode');
if (zip !== null) zip.onblur = function() {parseAddress();};
