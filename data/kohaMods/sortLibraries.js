/*** SORT ON LOGIN SCREEN ***/
var branchList=document.getElementById('branch'),
  allBranch = false,
  allBranchPos;
if (branchList !== null) {
  arrOptions=new Array();
  var selectedText = branchList.options[branchList.selectedIndex].text;
  for(i=1;i<branchList.length;i++){
    branchList.options[i].selected = false;
    arrOptions.push(new Array(branchList.options[i].text,branchList.options[i].value));
  }
  arrOptions.sort(function (a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  for(i=0;i<arrOptions.length;i++){
    branchList.options[i+1].text = arrOptions[i][0];
    branchList.options[i+1].value = arrOptions[i][1];
    if (branchList.options[i].text === selectedText) branchList.options[i].selected = true;
  }
}

/*** SORT FOR HOME LIBRARIES ***/
var branchList2=document.getElementById('branchcode');
if (branchList2 !== null) {
  arrOptions=new Array();
  var selectedText = branchList2.options[branchList2.selectedIndex].text;
  for(i=0;i<branchList2.length;i++){
    branchList2.options[i].selected = false;
    arrOptions.push(new Array(branchList2.options[i].text,branchList2.options[i].value));
  }
  arrOptions.sort(function (a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  for(i=0;i<branchList2.length;i++){
    branchList2.options[i].text = arrOptions[i][0];
    branchList2.options[i].value = arrOptions[i][1];
    if (branchList2.options[i].text === selectedText) branchList2.options[i].selected = true;
  }
  if (branchList2.children[1].value === "") {
    branchList2.insertBefore(branchList2.children[1], branchList2.children[0]);
  }

}

/*** SORT FOR HOLD PICKUP LOCATION ***/
var pickupList=document.getElementById('pickup');
if (pickupList !== null) {
  arrOptions=new Array();
  var selectedText = pickupList.options[pickupList.selectedIndex].text;
  for(i=0;i<pickupList.length;i++){
    arrOptions.push(new Array(pickupList.options[i].text,pickupList.options[i].value));
  }
  arrOptions.sort(function (a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  for(i=0;i<pickupList.length;i++){
    pickupList.options[i].text = arrOptions[i][0];
    pickupList.options[i].value = arrOptions[i][1];
    if (pickupList.options[i].text === selectedText) pickupList.options[i].selected = true;
  }
}

/*** SORT FOR WORK LIBRARIES ***/
var workLibList=document.getElementById('worklibrary');
if (workLibList !== null) {
  arrOptions=new Array();
  var selectedText = workLibList.options[workLibList.selectedIndex].text;
  for(i=1;i<workLibList.length;i++){
    workLibList.options[i].selected = false;
    arrOptions.push(new Array(workLibList.options[i].text,workLibList.options[i].value));
  }
  arrOptions.sort(function (a,b) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });
  for(i=0;i<arrOptions.length;i++){
    workLibList.options[i+1].text = arrOptions[i][0];
    workLibList.options[i+1].value = arrOptions[i][1];
    if (workLibList.options[i].text === selectedText) workLibList.options[i].selected = true;
  }
}
