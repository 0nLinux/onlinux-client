'use strict';

var OLUi = function() {
  console.log('Hooking controls...');
  this.machineData = {
    debian: {
      name: 'Debian',
      text: 'Debian is composed entirely of free software, most of which is under the GNU General Public License, and packaged by a group of individuals known as the Debian Project. Debian is a popular choice for personal computers and network servers, and has been used as a base for several other Linux distributions.',
      titleSVG: './img/debian-title.svg',
      link: {
        url: 'http://www.debian.org/',
        text: 'debian.org'
      }
    },
    ubuntu: {
      name: 'Ubuntu',
      text: 'Ubuntu comes with everything you need to run your organisation, school, home or enterprise. All the essential applications, like an office suite, browsers, email and media apps come pre-installed and thousands more games and applications are available in the Ubuntu software centre.',
      titleSVG: './img/ubuntu-title.svg',
      link: {
        url: 'http://www.ubuntu.com/desktop',
        text: 'ubuntu.com'
      }
    },
    elementary: {
      name: 'Elementary OS',
      text: 'A fast and open replacement for Windows and OS X.',
      titleSVG: './img/elementary-title.svg',
      link: {
        url: 'https://elementary.io/',
        text: 'elementary.io'
      }

    },
    mint: {
      name: 'Linux Mint',
      text: 'The purpose of Linux Mint is to produce a modern, elegant and comfortable operating system which is both powerful and easy to use.\n\nLinux Mint is the most popular desktop Linux distribution and the 3rd most widely used home operating system behind Microsoft Windows and Apple Mac OS.',
      titleSVG: './img/mint-title.svg',
      link: {
        url: 'http://www.linuxmint.com/',
        text: 'linuxmint.com'
      }
    },
    manjaro: {
      name: 'Manjaro',
      text: 'Enjoy the simplicity.',
      titleSVG: './img/manjaro-title.svg',
      link: {
        url: 'https://manjaro.github.io/',
        text: 'manjaro.github.io'
      }
    }
  }
  this.controls = {
    vncCanvas: document.getElementById('vnc-canvas'),
    infoCard: {
      card: document.getElementById('card-info'),
      title: document.getElementById('card-info-title'),
      textCard: document.getElementById('card-info-textcard'),
      starter: document.getElementById('button-start'),
      reqLog: {
        card: document.getElementById('info-request'),
        bullets: {
          queue: document.getElementById('requestlog-queue'),
          token: document.getElementById('requestlog-token'),
          connect: document.getElementById('requestlog-connect')
        }
      }
    },
    menu: {
      navElement: document.querySelector('.menu'),
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
  console.log('[UI] loaded.');
};

OLUi.prototype._hookControls = function() {
  var self = this;
  var menuOpener = this.controls.menu.opener;
  var menuItems = this.controls.menu.items;
  var menu = this.controls.menu.navElement;
  var starter = this.controls.infoCard.starter;
  for (var control in menuItems) {
    menuItems[control].addEventListener('click', function(evt) {
      menuOpener.checked = false;
      menu.style.height = '120px';
      self.setCardData('info', evt.target.dataset.type, self.machineData[evt.target.dataset.type]);
      self.toggleInfoCard(true);
    });
  }
  menuOpener.addEventListener('click', function(evt) {
    for (var control in menuItems) {
      menuItems[control].checked = false;
    }
    menu.style.height = '225px';
    self.toggleInfoCard(false);
  });
  starter.addEventListener('click', function(evt) {
    console.log('[UI] Requesting ' + evt.target.dataset.type + ' VM');
    self.toggleInfoCardText();
  });
  var progress = new UIProgressButton(document.getElementById('progress-button'), {
    callback : function( instance ) {
      var progress = 0
      var interval = setInterval( function() {
            progress = (Math.round((progress + 0.1) * 10) / 10);
            self.setLogBullets(progress);
            instance.setProgress(progress);
            if(progress === 1) {
              instance.stop(1);
              clearInterval(interval);
            }
          }, 150);
      self.setLogBullets(0);
    }
  });
};

OLUi.prototype.setLogBullets = function(progress) {
  var queueBulllet = this.controls.infoCard.reqLog.bullets.queue;
  var tokenBullet = this.controls.infoCard.reqLog.bullets.token;
  var connectBullet = this.controls.infoCard.reqLog.bullets.connect;
  switch (progress) {
    // initial state / queue request
    case 0:
      queueBulllet.checked = true;
      queueBulllet.disabled = false;
      tokenBullet.checked = tokenBullet.disabled = false;
      connectBullet.checked = connectBullet.disabled = false;
      break;
    // queue success
    case 0.3:
      queueBulllet.disabled = true;
      break;
    // token request
    case 0.4:
      tokenBullet.checked = true;
      break;
    // token success
    case 0.7:
      tokenBullet.disabled = true;
      break;
    // connect request
    case 0.8:
      connectBullet.checked = true;
      break;
    // connect success / start
    case 1:
      connectBullet.disabled = true;
      break;
  }
};

OLUi.prototype.toggleInfoCard = function(show) {
  var infoCard = this.controls.infoCard;
  var hasFadeIn = infoCard.card.classList.contains('fadeInUp');
  if (show && !hasFadeIn) {
    infoCard.card.classList.remove('fadeOutLeft');
    infoCard.title.classList.remove('fadeOutLeft');
    infoCard.textCard.classList.remove('fadeOutRight');
    infoCard.starter.classList.remove('fadeOutRight');

    infoCard.card.classList.add('fadeInUp');
    infoCard.title.classList.add('fadeInUp');
    infoCard.textCard.classList.add('fadeInDown');
    infoCard.starter.classList.add('fadeInUp');
  } else if (!show && hasFadeIn) {
    infoCard.card.classList.remove('fadeInUp');
    infoCard.title.classList.remove('fadeInUp');
    infoCard.textCard.classList.remove('fadeInDown');
    infoCard.starter.classList.remove('fadeInUp');

    infoCard.card.classList.add('fadeOutLeft');
    infoCard.title.classList.add('fadeOutLeft');
    infoCard.textCard.classList.add('fadeOutRight');
    infoCard.starter.classList.add('fadeOutRight');
    if (infoCard.reqLog.card.classList.contains('fadeInUp')) {
      this.toggleInfoCardText();
    }
  }
};

OLUi.prototype.toggleInfoCardText = function() {
  this.controls.infoCard.textCard.querySelector('#info-text').classList.toggle('fadeOutUp');
  this.controls.infoCard.reqLog.card.classList.toggle('fadeInUp');
};

OLUi.prototype.setCardData = function(type, selection, data) {
  var infoCard = this.controls.infoCard;
  var linkHTML = '<a href="' + data.link.url + '" target="_blank">' + data.link.text + '</a>';
  var starterText = 'Try ' + data.name + ' now!';
  if (type === 'info') {
    infoCard.textCard.querySelector('#info-text').innerText = data.text;
    infoCard.textCard.querySelector('#info-link').innerHTML = linkHTML;
    infoCard.title.children[0].src = data.titleSVG;
    infoCard.starter.innerText = starterText;
    infoCard.starter.dataset.type = selection;
  }
};

var olui;
var startOLUi = function() {
  console.log('[UI] Starting...');
  olui = new OLUi();
}();
