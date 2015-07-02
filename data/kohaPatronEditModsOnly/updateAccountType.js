(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  var birthdayField = document.getElementById('dateofbirth'),
    birthday = null,
    patronCategory = document.getElementsByName('categorycode')[0],
    saveButtonWrapper = document.getElementsByClassName('action')[0],
    saveButton = null,
    updateButton = document.createElement('input');
  
  if (patronCategory && patronCategory.value) {
    if (birthdayField && birthdayField.value) {
      birthday = new Date(birthdayField.value);
    }
  
    if (saveButtonWrapper) {
      saveButton = saveButtonWrapper.children[0];
    }
  
    updateButton.type = "button";
    updateButton.value = "Save & update patron type"
    updateButton.style = 'cursor:pointer;';
  }
}()); //end use strict