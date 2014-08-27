/*** THIS CODE WAS BORROWED FROM LIBLIME'S
     members.js FILE AND MUST BE UPDATED WITH EACH KOHA
     UPDATE ***/
function confirmSubmit() {
  if ( confirm( "Are You Sure You Want To Save?" ) ) {
    return true;
  } else {
    return false;
  }
}

// function to test all fields in forms and nav in different forms(1 ,2 or 3)
function check_form_borrowers(nav){
  var statut=0;
  if (document.form.check_member.value == 1 ) {
    if (document.form_double.answernodouble) {
      if( (!(document.form_double.answernodouble.checked))){
        document.form.nodouble.value=0;
      } else {
        document.form.nodouble.value=1;
      }
    }
  } 
	
  if (document.form.BorrowerMandatoryField.value != '') {
    var champ_verif = document.form.BorrowerMandatoryField.value.split ('|');
    var message ="The following fields are mandatory :\n";
    var message_champ="";
    for (var i=0; i<champ_verif.length; i++) {
      if (document.getElementsByName(""+champ_verif[i]+"")[0]) {
        var val_champ=eval("document.form."+champ_verif[i]+".value");
        var ref_champ=eval("document.form."+champ_verif[i]);
        //check if it's a select
        if (ref_champ.type=='select-one') {
          // check to see if first option is selected and is blank
          if (ref_champ.options[0].selected && ref_champ.options[0].text == ''){
            // action if field is empty
            message_champ+=champ_verif[i]+"\n";
            //test to know if you must show a message with error
            statut=1;
          }
        } else {
          if ( val_champ == '' ) {
            // action if the field is not empty
            message_champ+=champ_verif[i]+"\n";
            statut=1;
          }	
        }
      }
    }
  }
  //patrons form to test if you checked no to the question of double
  if (statut!=1 && document.form.check_member.value > 0 ) {
    if (!(document.form_double.answernodouble.checked)){
      message ="";
      message_champ+=("Please confirm suspicious duplicate patron !!! ");
      statut=1;
      document.form.nodouble.value=0;
    } else {
      document.form.nodouble.value=1;
    }
  }
		
  if (statut==1){
    //alert if at least 1 error
    alert(message+"\n"+message_champ);
    return false;
  } else {
    var doSubmit = confirmSubmit();
    if ( doSubmit ) {
      document.form.submit();
    } else {
      return false;
    }
  }
}
/*** END BORROWED CODE ***/

/*** CHECK AGAINST LIST OF UNACCEPTABLE
     AND RESTRICTED ADDRESSES ***/
function restoreSave() {
  var s = document.getElementsByName('save')[0];
  if (s !== null) {
    s.type='submit';
    s.value='Save';
    s.onclick = function() {
      return check_form_borrowers();
    };
    return false;
  }
}

function blockSubmit() {
  var s = document.getElementsByName('save')[0];
  if (s !== null) {
    s.type='button';
    s.value='Override Block';
    s.onclick = function() {
      restoreSave();
      return false;
    };
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
  var city = document.getElementById('city');
  
  if (city != null && addr != null) {
    addrRegEx = /[ ]*15(10|20) tripp.*|[ ]*970 university.*|[ ]*(625|635|640|650) elm.*|[ ]*(35|420).{0,7}park.*|[ ]*1200 observatory.*|[ ]*16(35|50) kronshage.*|[ ]*(835|917|919|921).{0,6}dayton.*|[ ]*1950 willow.*|[ ]*(615|821|917).{0,6}johnson.*|[ ]*625 babcock.*/i;
    var addressVal = addr2 != null ? addr.value + " " + addr2.value : addr.value;
    var cityRegEx = /madison([,]? wi.*)?/i;
    
    if (addrRegEx.test(addressVal) && cityRegEx.test(city)) {
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
if (city !== null) city.onblur = function() {parseBadAddr(); parseAddress();};
