(function () {"use strict"; /*jslint browser:true regexp: true indent: 2 devel: true plusplus: true*/
  /*global self*/

  self.on("context", function() {
    // Show menu item when on a webpage of scls-staff.kohalibrary.com
    // and when there is an element with the class name 'patroninfo'
    return window.location.hostname == "scls-staff.kohalibrary.com" && document.getElementsByClassName('patroninfo').length > 0;
  });

  self.on("click", function() {
    var pi = document.getElementsByClassName('patroninfo'),
      name,
      l,
      first,
      last,
      email,
      type,
      home,
      msg;
    if (pi.length > 0) {
      pi = pi[0].children;
      name = pi[0].textContent.substr(0,pi[0].textContent.length-17).replace('  ',' ');
      l = name.split(' ').length;
      first = name.split(' ')[0];
      first = first[0].toUpperCase() + first.substr(1).toLowerCase();
      last = name.split(' ')[l-1];
      last = last[0].toUpperCase() + last.substr(1).toLowerCase();
      if (pi[1].children[3].children.length > 0) {
        email = pi[1].children[3].children[0].title;
        type = pi[1].children[4].textContent.match(/\(([^)]+)\)/)[1];
        home = pi[1].children[5].textContent.replace('Home Library: ','');
      } else {
        email = pi[1].children[4].children[0].title;
        type = pi[1].children[5].textContent.match(/\(([^)]+)\)/)[1];
        home = pi[1].children[6].textContent.replace('Home Library: ','');
      }
      switch (home) {
        case 'Adams County Library': home = 'ACL';break;
        case 'Baraboo Library': home = 'BAR';break;
        case 'Belleville Library': home = 'BLV';break;
        case 'Black Earth Library': home = 'BER';break;
        case 'Bookmobile-Dane County Library': home = 'DCL';break;
        case 'Brodhead Memorial Public Library': home = 'BRD';break;
        case 'Cambria - Jane Morgan Library': home = 'CIA';break;
        case 'Cambridge Library': home = 'CBR';break;
        case 'Columbus Library': home = 'COL';break;
        case 'Cross Plains Library': home = 'CSP';break;
        case 'DeForest Library': home = 'DFT';break;
        case 'Deerfield Library': home = 'DEE';break;
        case 'Fitchburg Public Library': home = 'FCH';break;
        case 'Kilbourn Public Library': home = 'WID';break;
        case 'LaValle Library': home = 'LAV';break;
        case 'Lester Public Library of Arpin': home = 'ARP';break;
        case 'Lester Public Library of Rome': home = 'ROM';break;
        case 'Lodi Library': home = 'LDI';break;
        case 'Madison PL-Ashman': home = 'HPB';break;
        case 'Madison PL-Central': home = 'MAD';break;
        case 'Madison PL-Hawthorne': home = 'HAW';break;
        case 'Madison PL-Lakeview': home = 'LAK';break;
        case 'Madison PL-MRS: AUTHORIZED USERS ONLY': home = 'MRS';break;
        case 'Madison PL-Meadowridge': home = 'MEA';break;
        case 'Madison PL-Monroe St': home = 'MSB';break;
        case 'Madison PL-Pinney': home = 'PIN';break;
        case 'Madison PL-Sequoya': home = 'SEQ';break;
        case 'Madison PL-So. Madison': home = 'SMB';break;
        case 'Marshall Library': home = 'MAR';break;
        case 'Mazomanie Library': home = 'MAZ';break;
        case 'McFarland - E.D. Locke Library': home = 'MCF';break;
        case 'Middleton Library': home = 'MID';break;
        case 'Monona Library': home = 'MOO';break;
        case 'Monroe PL-Green County': home = 'MRO';break;
        case 'Mount Horeb Library': home = 'MTH';break;
        case 'New Glarus Library': home = 'NGL';break;
        case 'North Freedom Library': home = 'NOF';break;
        case 'Oregon Library': home = 'ORE';break;
        case 'PCPL-Almond branch': home = 'ALM';break;
        case 'PCPL-Plover branch': home = 'PLO';break;
        case 'PCPL-Rosholt branch': home = 'ROS';break;
        case 'PCPL-Stevens Point branch': home = 'STP';break;
        case 'Pardeeville Library': home = 'PAR';break;
        case 'Plain-Kraemer Library': home = 'PLA';break;
        case 'Portage Library': home = 'POR';break;
        case 'Poynette Library': home = 'POY';break;
        case 'Randolph - Hutchinson Memorial Library': home = 'RAN';break;
        case 'Reedsburg Library': home = 'REE';break;
        case 'Rock Springs Library': home = 'RKS';break;
        case 'Ruth Culver Community Library': home = 'PDS';break;
        case 'SCLS Electronic Library': home = 'SCL';break;
        case 'SCLS Headquarters': home = 'SCA';break;
        case 'Sauk City Library': home = 'SKC';break;
        case 'Spring Green Library': home = 'SGR';break;
        case 'Stoughton Library': home = 'STO';break;
        case 'Sun Prairie Library': home = 'SUN';break;
        case 'Verona Public Library': home = 'VER';break;
        case 'Waunakee Library': home = 'WAU';break;
        case 'Wis. Rapids - McMillan Library': home = 'MCM';break;
        case 'Wyocena Library': home = 'WYO';break;
        case 'XNEK - DO NOT USE': home = 'NEK';break;
        case 'XYZ DO NOT USE': home = 'CEN';break;
        case 'ZZZ-Authorized users only!': home = 'ZZZ';break;
        default: home = '';break;
      }
      msg = first+"\t"+last+"\t"+email+"\t"+type+"\t"+home;
      self.postMessage(msg);
    }
  });
}()); //end use strict
