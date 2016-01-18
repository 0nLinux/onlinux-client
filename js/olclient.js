'use strict'

var olcl;

// wait for DOM to be loaded before doing anything
//document.addEventListener('DOMContentLoaded', startOLClient);

var OLClient = function() {
  this._host = '127.0.0.1';
  this._vncport = 5900;
  this._guid = this._guidGenerator();
  this._connected = false;
  this._distro = 'debian';
  this._xhr;
  console.log('Hooking controls...');
  this._hookControls();
};

OLClient.prototype._hookControls = function() {
  var self = this;
  document.getElementById('btnRequest').addEventListener('click', function() {
    console.log('VM Requested by user.');
    var valHost = document.getElementById('inpHost').value;
    valHost = (valHost && valHost !== '' && valHost !== self._host) ? valHost :
                                                                      self._host;
    var valDistro = document.getElementById('selDistro').value;
    valDistro = (valDistro && valDistro !== '' && valDistro !== self._distro) ? valDistro :
                                                                                self._distro;
    console.log('Sending request for \'' + valDistro + '\' to ' + valHost);
    self.requestVM(valHost, valDistro);
  });
  console.log('... controls hooked.');
};

OLClient.prototype.requestVM = function(host, distro) {
  var self = this;
  this._xhr = new XMLHttpRequest();
  this._xhr.onreadystatechange = self._xhrHandler;
  this._xhr.open('GET', 'http://' + host + ':1215/canIhasaVM');
  this._xhr.send();
};

OLClient.prototype._xhrHandler = function(evt) {
  var srcXHR = evt.srcElement;
  if (srcXHR.readyState === XMLHttpRequest.DONE) {
    if (srcXHR.status === 200) {
      console.log(srcXHR.responseText);
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
