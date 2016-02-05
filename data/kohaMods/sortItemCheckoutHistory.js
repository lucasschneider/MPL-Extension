(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/

  function ItemHistoryEntry(htmlTR) {
    this.html = htmlTR;
    this.date = "";
    this.dateDue = "";
    this.returnDate = "";

    if (htmlTR.children.length > 7) {
      this.date = htmlTR.children[0].textContent.replace(/\s/g, "") !== "" ? new Date(htmlTR.children[0].textContent.replace(/\s/g, "")) : new Date();
      this.dateDue = htmlTR.children[6].textContent.replace(/\s/g, "") !== "" ? new Date(htmlTR.children[6].textContent.replace(/\s/g, "")) : new Date();
      this.returnDate = htmlTR.children[7].textContent.replace(/\s/g, "") !== "" ? new Date(htmlTR.children[7].textContent.replace(/\s/g, "")) : new Date();
    }
  }

  function sortTable(itemHistoryEntries, sortCode) {
    switch(sortCode) {
      // Due date, ASC
      case "dueASC":
        itemHistoryEntries.sort(function(a, b) {
          return a.dateDue - b.dateDue;
        });
        break;
      // Due date, DESC
      case "dueDESC":
        itemHistoryEntries.sort(function(a, b) {
          return b.dateDue - a.dateDue;
        });
        break;
      // Return date, ASC
      case "returnASC":
        itemHistoryEntries.sort(function(a, b) {
          return a.returnDate - b.returnDate;
        });
        break;
      // Return date, DESC
      case "returnDESC":
        itemHistoryEntries.sort(function(a, b) {
          return b.returnDate - a.returnDate;
        });
        break;
      // Checkout date, ASC
      case "checkoutASC":
        itemHistoryEntries.sort(function(a, b) {
          return a.date - b.date;
        });
        break;
      // Checkout date, DESC
      case "checkoutDESC":
      default:
        itemHistoryEntries.sort(function(a, b) {
          return b.date - a.date;
        });
    }
    
    var tbody = document.createElement('tbody');
    
    for (var trObj of itemHistoryEntries) {
      tbody.appendChild(trObj.html);
    }
    
    var historyTable = document.getElementById('checkouthistt'),
    historyTbody;
    
    if (historyTable) {
      historyTbody = historyTable.children[1];
      if (historyTbody) {
        historyTable.replaceChild(tbody, historyTbody);
      }
    }
  }

  var historyTable = document.getElementById('checkouthistt'),
    h1Elts = document.getElementsByTagName('h1'),
    h1Parent,
    h1Sibling,
    itemRowArray,
    itemHistoryEntries = [],
    wrapper;
    
  if (historyTable && h1Elts) {
    
    itemRowArray = historyTable.children[1].children;
    if (itemRowArray && itemRowArray.length > 1) {
      for (var tr of itemRowArray) {
        itemHistoryEntries.push(new ItemHistoryEntry(tr));
      }
      sortTable(itemHistoryEntries,"checkoutDESC");
    }
    
    var sheet = window.document.styleSheets[1];
    sheet.insertRule('#sortSelectTable thead { font-weight: bold; }', sheet.cssRules.length);
    sheet.insertRule('#sortSelectTable tbody { cursor: pointer; }', sheet.cssRules.length);
    sheet.insertRule('#sortSelectTable td { text-align: center; }', sheet.cssRules.length);
    sheet.insertRule('.selectedSort { background: #99B7EE; cursor: default; }', sheet.cssRules.length);
    
    wrapper = document.createElement('div');
    wrapper.id = "sortWrapper";
    wrapper.style = "padding-left:50px;";
    wrapper.innerHTML = '<h3>Sort by...</h3><table id="sortSelectTable"><thead><tr><td colspan="2">Checkout Date</td><td colspan="2">Due Date</td><td colspan="2">Return Date</td></tr></thead><tbody><tr id="sortOptions"><td id="checkoutASC">ASC</td><td id="checkoutDESC" class="selectedSort">DESC</td><td id="dueASC">ASC</td><td id="dueDESC">DESC</td><td id="returnASC">ASC</td><td id="returnDESC">DESC</td></tr></tbody></table>';
    
    h1Parent = h1Elts[h1Elts.length-1].parentElement;
    h1Sibling = h1Parent.children[1];
    
    h1Parent.insertBefore(wrapper, h1Sibling);
    
    for (var td of document.getElementById('sortOptions').children) {
      td.addEventListener('click', function () {
        if (this.className !== "selectedSort") {
          for (var td of document.getElementById('sortOptions').children) {
            td.className = "";
          }
          this.className = "selectedSort";
          sortTable(itemHistoryEntries, this.id);
        }
      });
    }
  }
  }()); //end use strict
