'use strict';

var OLUi = function() {
  console.log('Hooking controls...');
  this.machineData = {
    debian: {
      text: 'Debian is composed entirely of free software, most of which is under the GNU General Public License, and packaged by a group of individuals known as the Debian Project. Debian is a popular choice for personal computers and network servers, and has been used as a base for several other Linux distributions.',
      titleSVG: './img/debian-title.svg'
    },
    ubuntu: {
      text: 'Ubuntu comes with everything you need to run your organisation, school, home or enterprise. All the essential applications, like an office suite, browsers, email and media apps come pre-installed and thousands more games and applications are available in the Ubuntu software centre.',
      titleSVG: './img/ubuntu-title.svg'
    },
    elementary: {
      text: 'A fast and open replacement for Windows and OS X.',
      titleSVG: './img/elementary-title.svg'
    },
    mint: {
      text: 'The purpose of Linux Mint is to produce a modern, elegant and comfortable operating system which is both powerful and easy to use.\n\nLinux Mint is the most popular desktop Linux distribution and the 3rd most widely used home operating system behind Microsoft Windows and Apple Mac OS.',
      titleSVG: './img/mint-title.svg'
    },
    manjaro: {
      text: 'Enjoy the simplicity.',
      titleSVG: './img/manjaro-title.svg'
    }
  }
  this.controls = {
    vncCanvas: document.getElementById('vnc-canvas'),
    infoCard: {
      card: document.getElementById('card-info'),
      title: document.getElementById('card-info-title'),
      textCard: document.getElementById('card-info-textcard')
    },
    menu: {
      opener: document.getElementById('menu-open'),
      items: {
        debian: document.getElementById('menu-item-debian'),
        elementary: document.getElementById('menu-item-elementary'),
        manjaro: document.getElementById('menu-item-manjaro'),
        mint: document.getElementById('menu-item-mint'),
        ubuntu: document.getElementById('menu-item-ubuntu')
      }
    }
  };
  this._hookControls();
};

OLUi.prototype._hookControls = function() {
  var self = this;
  var menuOpener = this.controls.menu.opener;
  var menuItems = this.controls.menu.items;
  for (var control in menuItems) {
    menuItems[control].addEventListener('click', function(evt) {
      menuOpener.checked = false;
      self.setCardData('info', self.machineData[evt.target.dataset.type]);
      self.toggleInfoCard(true);
    });
  }
  menuOpener.addEventListener('click', function(evt) {
    for (var control in menuItems) {
      menuItems[control].checked = false;
      self.toggleInfoCard(false);
    }
  });
};

OLUi.prototype.toggleInfoCard = function(show) {
  var infoCard = this.controls.infoCard;
  var hasFadeIn = infoCard.card.classList.contains('fadeInUp');
  if (show && !hasFadeIn) {
    infoCard.card.classList.add('fadeOutLeft');
    infoCard.title.classList.add('fadeOutLeft');
    infoCard.textCard.classList.add('fadeOutRight');

    infoCard.card.classList.add('fadeInUp');
    infoCard.title.classList.add('fadeInUp');
    infoCard.textCard.classList.add('fadeInDown');
  } else if (!show && hasFadeIn) {
    infoCard.card.classList.remove('fadeInUp');
    infoCard.title.classList.remove('fadeInUp');
    infoCard.textCard.classList.remove('fadeInDown');

    infoCard.card.classList.add('fadeOutLeft');
    infoCard.title.classList.add('fadeOutLeft');
    infoCard.textCard.classList.add('fadeOutRight');
  }
};

OLUi.prototype.setCardData = function(type, data) {
  var infoCard = this.controls.infoCard;
  if (type === 'info') {
    infoCard.textCard.children[0].innerText = data.text;
    infoCard.title.children[0].src = data.titleSVG;
  }
};

var olui;
var startOLUi = function() {
  console.log('Starting OnLinux UI...');
  olui = new OLUi();
}();
