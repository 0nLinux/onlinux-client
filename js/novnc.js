/*global window, $, Util, RFB, */
'use strict';
var INCLUDE_URI = 'js/novnc/'
var olvnc;
// Load supporting scripts
Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js",
                   "keysymdef.js", "keyboard.js", "input.js", "display.js",
                   "inflator.js", "rfb.js", "keysym.js"]);


var OLVnc = function() {
  this._rfb = new RFB({'target': olui.controls.vncCanvas,
                 'encrypt':      WebUtil.getConfigVar('encrypt',
                                 (window.location.protocol === "https:")),
                 'repeaterID':   '',
                 'true_color':   true,
                 'local_cursor': true,
                 'shared':       false,
                 'view_only':    false,
                 'onUpdateState':  this.updateState,
                 'onXvpInit':    this.xvpInit,
                 'onPasswordRequired':  this.passwordRequired,
                 'onFBUComplete': this.FBUComplete
                });
  this.host = '127.0.0.1';
  this.port = 5900;
  this.password = 'onlinux';
  this.path = 'websockify?token=';
  this.online = false;
};

OLVnc.prototype.updateState = function(rfb, status) {
  console.log('Update State');
  if (status === 'disconnected' && this.online) {
    olui.hideCanvas();
  }
};
OLVnc.prototype.xvpInit = function() {
  console.log('xvpINIT');
  this.online = true;
  olcl._fnStatus(null, 1);
};
OLVnc.prototype.passwordRequired = function() {
  console.log('passwordRequired');
  console.log(arguments);
};
OLVnc.prototype.FBUComplete = function() {
  console.log('FBUComplete');
  console.log(arguments);
};
OLVnc.prototype.start = function(host, port, token) {
  this.host = host;
  this.port = port;
  this.path = this.path + token;
  olcl._fnStatus(null, 0.8);
  this._rfb.connect(this.host, this.port, this.password, this.path);
};

window.onscriptsload = function() {
  olvnc = new OLVnc();
};
