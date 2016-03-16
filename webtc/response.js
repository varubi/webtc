var Cookies = require('./cookies'),
  _FS = require('fs'),
  _URL = require('url');

function Response(Request, Response) {
  var self = this;
  this._REQUEST = Request;
  this._RESPONSE = Response;
  this.Response = {};
  this.Config;
  this.CookieManager = new Cookies();
  this.Url;

  this.Connection = {}
  this.Connection.Request = this._REQUEST;
  this.Connection.Request.Body = '';
  this.Connection.IpAddress = this._REQUEST.connection.remoteAddress

  this.Connection.Data = {};
  this.Connection.Data.Cookie = this.CookieManager.parseCookie(this._REQUEST.headers['cookie']);
  this.Connection.Data.Get;
  this.Connection.Data.Post = {};
  this.Connection.Data.Session;

  this.Connection.Response = {};
  this.Connection.Response.Code = 200;
  this.Connection.Response.Headers = {};
  this.Connection.Response.Headers['Content-Type'] = 'text/plain';
  this.Connection.Response.Encoding = 'UTF-8'
  this.Connection.Response.Body = '';

  this.Connection.Locals = {};

  this.Connection.Response.Cookies = self.CookieManager.Cookies
  this.Connection.Response.SetCookie = function(Name, Value, Domain, Path, Expires, MaxAge, Secure, HttpOnly) {
    self.CookieManager.setCookie(Name, Value, Domain, Path, Expires, MaxAge, Secure, HttpOnly)
  }
  this.Connection.Response.End = function() {
    self.write()
  };
  Object.defineProperty(this.Connection, 'Url', {
    get: function() {
      return self.Url
    },
    set: function(URL) {
      self.Url = URL
      this.Data.Get = URL.query
    }
  })
  this.Connection.SessionID = (this.Connection.Data.Cookie.hasOwnProperty('SessionID') ? this.Connection.Data.Cookie['SessionID'] : '');
}

Response.prototype.accessFile = function(ResponseCode, Filepath) {
  var self = this;
  this.Connection.Response.Code = ResponseCode;
  FilePath = Filepath;
  var ext = Filepath.replace(/^.*[/.]([^/.]+)$/, '$1')
  if (this.Config.MIMETypes.hasOwnProperty(ext))
    this.Connection.Response.Headers['Content-Type'] = this.Config.MIMETypes[ext]

  if (this.Config.ExecutableFileExtensions.indexOf(ext) > -1) {
    try {
      if (this.Config.ClearCache)
        delete require.cache[require.resolve(FilePath)]
      var x = require(FilePath)
      this.Connection.Request.StopTime = new Date().getTime()
      x.response(this.Connection);
    } catch (e) {
      this.Connection.Response.Body = e.stack;
      this.write();
    }
  } else {
    if (this.Connection.Response.Code != 404) {
      _FS.readFile(Filepath, function(err, data) {
        self.Connection.Response.Body += data
        self.write();
      });
    } else {
      this.Connection.Response.Body += 'File Not Found: ' + FilePath
      this.write();
    }
  }
}


Response.prototype.write = function() {
  this._RESPONSE.setHeader('Set-Cookie', 'SessionID=' + this.Connection.SessionID + '; HttpOnly')
    // this._RESPONSE.setHeader('Set-Cookie', this.CookieManager.buildHeader())
  this._RESPONSE.writeHead(this.Connection.Response.Code, this.Connection.Response.Headers)
  this._RESPONSE.write(this.Connection.Response.Body, this.Connection.Response.Encoding);
  if (typeof this.Config.OnResponseComplete == 'function')
    this.Config.OnResponseComplete(this)


  this._RESPONSE.end();
}

module.exports = Response;
