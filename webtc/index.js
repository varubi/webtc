var https_server = false,
    _HTTP = require("http"),
    _HTTPS = require('https'),
    _FS = require('fs'),
    _URL = require('url'),
    _QUERYSTRING = require('querystring'),
    Configurer = require('./configuration.js'),
    FileSystem = require('./filesystem.js'),
    Sessions = require('./sessions.js'),
    Response = require('./response.js'),
    Configuration = new Configurer();
exports.setServerConfig = function(Config) {
    Configuration.setServerConfig(Config);
}
exports.setDomainConfig = function(Config, DomainName, TemplateDomainName) {
    if (typeof DomainName == 'string')
        Configuration.setDomainConfig(Config, DomainName, TemplateDomainName)
    else
        Configuration.setGlobalConfig(Config)
}


function WebServer() {
    this.SessionManager = new Sessions(Configuration.ServerConfig.Session);
}
WebServer.prototype.newResponse = function(request, response) {
    try {
        if (Configuration.ServerConfig.Protocols)
            var Config = Configuration.getConfig(request.headers.host);
        var R = new Response(request, response);
        var F = new FileSystem(Config);
        var self = this;
        R.Config = Config;

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
            R.Connection.Data.DomainDataBox = R.Config.DataBox;
            R.Connection.Data.ServerDataBox = Configuration.ServerConfig.DataBox;
            R.Connection.Url = F.ResolveURL(request.url)
            F.ResolveFile(Config.Basepath + R.Connection.Url.pathname, function(ResponseCode, Filepath) {
                R.accessFile(ResponseCode, Filepath)
            });
        }
    } catch (e) {
        response.write(e.toString());
        response.end();
    }
}

exports.start = function() {
    if (Configuration.ServerConfig.Protocols.HTTP.Port) {
        HTTPServer = new WebServer();
        _HTTP.createServer(function(request, response) {
            request.StartTime = new Date().getTime()
            HTTPServer.newResponse(request, response);
        }).listen(Configuration.ServerConfig.Protocols.HTTP.Port);
    }
    var httpsOptions;
    if (Configuration.ServerConfig.Protocols.HTTPS.Key && Configuration.ServerConfig.Protocols.HTTPS.Certificate)
        httpsOptions = {
            key: fs.readFileSync(Configuration.ServerConfig.Protocols.HTTPS.Key),
            cert: fs.readFileSync(Configuration.ServerConfig.Protocols.HTTPS.Certificate)
        }

    if (Configuration.ServerConfig.Protocols.HTTPS.Port && httpsOptions) {
        https_server = true
        HTTPSServer = new WebServer();
        _HTTPS.createServer(httpsOptions, function(request, response) {
            request.StartTime = new Date().getTime()
            HTTPSServer.newResponse(request, response);
        }).listen(Configuration.ServerConfig.Protocols.HTTPS.Port);
    }
}
