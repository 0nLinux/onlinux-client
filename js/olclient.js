'use strict'

// global client instance
var olcl;

// wait for DOM to be loaded before doing anything
//document.addEventListener('DOMContentLoaded', startOLClient);

var OLClient = function() {
  this._host = '127.0.0.1';
  this._port = 1215;
  this._vncport = 5900;
  this._vncToken = 0;
  this._httpString = 'http://' + this._host + ':' + this._port + '/';
  this._guid = this._guidGenerator();
  this._connected = false;
  this._distro = 'debian';
  this._xhr;
  this._reqPatience = 1000;
};

OLClient.prototype._updateHttpString = function() {
  this._httpString = 'http://' + this._host + ':' + this._port + '/';
};

OLClient.prototype._requestVM = function() {
  this._xhr = new XMLHttpRequest();
  this._xhr.onreadystatechange = this._xhrHandler;
  // ...:1215/ICanHaZVM?
  this._xhr.open('GET', this._httpString + 'ichzvm?' + this._distro + '&' + this._guid);
  this._xhr.send();
};

OLClient.prototype._askStatus = function() {
  if (olcl._xhr) {
    // ...:1215/YouDoneAlready?
    olcl._xhr.open('GET', olcl._httpString + 'yda?' + olcl._guid);
    olcl._xhr.send();
  }
};

OLClient.prototype._xhrHandler = function(evt) {
  var srcXHR = evt.srcElement;
  var data;
  if (srcXHR.readyState === XMLHttpRequest.DONE) {
    if (srcXHR.status === 200) {
      try {
        data = JSON.parse(srcXHR.responseText);
        console.info('Server responded: ' + data.status);
        switch (data.status) {
          case 'booting':
            window.setTimeout(olcl._askStatus, olcl._reqPatience);
            break;
          case 'waiting':
            console.info('Still waiting for VM. :/');
            window.setTimeout(olcl._askStatus, olcl._reqPatience);
            break;
          case 'token':
            console.log('Server passed a VNC token: ' + data.token);
            olcl.getThePartyStarted();
            break;
          default:
            console.warn('I really don\'t know what to do with:');
            console.warn(data);
        }
      } catch (err) {
        console.error('Couldn\'t parse response: ' + srcXHR.responseText);
        console.error(err);
      }
    } else {
      console.log('Request failed with status: ' + srcXHR.status);
    }
  }
};

OLClient.prototype._guidGenerator = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

var startOLClient = function() {
  console.log('Starting OnLinux Client...');
  olcl = new OLClient();
}();
