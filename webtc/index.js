var _HTTP = require("http"),
  _FS = require('fs'),
  _URL = require('url'),
  _QUERYSTRING = require('querystring'),
  Config = require('./config.json'),
  FileSystem = require('./filesystem.js'),
  Sessions = require('./sessions.js'),
  Response = require('./response.js');

exports.setConfig = function(CONFIG, OVERWRITE) {
  if (OVERWRITE) {
    for (var property in Config)
      if (Config.hasOwnProperty(property))
        if (CONFIG.hasOwnProperty(property))
          Config[property] = CONFIG[property]
  } else {
    for (var property in Config)
      if (Config.hasOwnProperty(property))
        if (CONFIG.hasOwnProperty(property)) {
          if (typeof Config[property] == typeof CONFIG[property] && ['string', 'boolean', 'number'].indexOf(typeof Config[property]) > -1)
            Config[property] = CONFIG[property]
          if (typeof Config[property] == 'object') {
            if (Array.isArray(Config[property]) && Array.isArray(CONFIG[property]))
              for (var i = 0; i < CONFIG[property].length; i++)
                if (Config[property].indexOf(CONFIG[property][i]) < 0)
                  Config[property].push(CONFIG[property][i])
            if (!Array.isArray(Config[property]) && !Array.isArray(CONFIG[property]))
              for (var nestedProperty in CONFIG[property])
                Config[property][nestedProperty] = CONFIG[property][nestedProperty]
          }
        }
  }
}

function WebServer() {
  this.FileManager = new FileSystem(Config);
  this.SessionManager = new Sessions(Config);
}
WebServer.prototype.newResponse = function(request, response) {
  var R = new Response(request, response);
  var self = this;
  R.Config = this.FileManager.Config;

  if (R.Connection.Request.headers['content-type'] == 'application/x-www-form-urlencoded') {
    R.Connection.Request.on('data', function(data) {
      R.Connection.Request.Body += data;
      if (R.Connection.Request.Body.length > 1e6)
        R.Connection.Request.connection.destroy();
    });
    R.Connection.Request.on('end', function() {
      R.Connection.Data.Post = _QUERYSTRING.parse(R.Connection.Request.Body);
      runResponse()
    });
  } else {
    runResponse();
  }
  function runResponse() {
    var SessionID = self.SessionManager.validateSession(R.Connection.SessionID, R.Connection.IpAddress);
    R.Connection.Data.Session = self.SessionManager.Sessions[SessionID].Value
    R.Connection.SessionID = SessionID
    R.Connection.Url = self.FileManager.ResolveURL(request.url)
    self.FileManager.ResolveFile(R.Config.Basepath + R.Connection.Url.pathname, function(ResponseCode, Filepath) {
      R.accessFile(ResponseCode, Filepath)
    });
  }
}

exports.listen = function(PORT) {
  var Server = new WebServer();
  _HTTP.createServer(function(request, response) {
    request.StartTime = new Date().getTime()
    Server.newResponse(request, response);
  }).listen(PORT);
}
