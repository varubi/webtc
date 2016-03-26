var _CRYPTO = require('crypto');

function Session() {
  this.Expiration;
  this.IPAddress;
  this.Duration = 120000;
  this.resetExpiration();
  this.Value = {}
}
Session.prototype.resetExpiration = function() {
  this.Expiration = ((new Date() / 1) + this.Duration)
}

function SessionManagement(CONFIG) {
  var self = this;
  this.Config = CONFIG;
  this.Sessions = {};
  this.PurgeInterval = setInterval(function() {
    self.purge()
  }, 120000)
}
SessionManagement.prototype.createNewSession = function(IPAddress) {
  var r = "";
  var BufferAry = [];
  BufferAry.length = 16
  for (var i = 0; i < 16; i++) {
    BufferAry[i] = _CRYPTO.randomBytes(1).toString('hex')
  }
  BufferAry.splice(4, 0, '-');
  BufferAry.splice(7, 0, '-');
  BufferAry[8] = "4" + BufferAry[8].substring(1)
  BufferAry.splice(10, 0, '-');
  if (['8', '9', 'a', 'b'].indexOf(BufferAry[11].substring(0)) == -1)
    BufferAry[11] = ['8', '9', 'a', 'b'][parseInt(_CRYPTO.randomBytes(1).toString('hex'), 16) % 4] + BufferAry[11].substring(1)
  BufferAry.splice(13, 0, '-');
  r = BufferAry.join("");
  this.Sessions[r] = new Session();
  this.Sessions[r].Duration = this.Config.Duration;
  this.Sessions[r].IPAddress = IPAddress;
  return r;
}
SessionManagement.prototype.validateSession = function(SessionID, IPAddress) {
  if (/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(SessionID) && this.Sessions.hasOwnProperty(SessionID) && (!this.Config.IPLink || this.Sessions[SessionID].IPAddress == IPAddress)) {
    this.Sessions[SessionID].resetExpiration()
    return SessionID;
  }
  return this.createNewSession(IPAddress);
}
SessionManagement.prototype.purge = function() {
  var Timestamp = (new Date() / 1)
  for (var Session in this.Sessions)
    if (this.Sessions.hasOwnProperty(Session))
      if (this.Sessions[Session].Expiration < Timestamp)
        delete this.Sessions[Session]
}
module.exports = SessionManagement;
