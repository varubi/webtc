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
    this.Connection.Data.ServerDataBox = {};
    this.Connection.Data.DomainDataBox = {};

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

    if (this.Connection.Response.Code == 200) {
        if (this.Config.DynamicFileExtensions.indexOf(ext) > -1) {
            try {
                if (this.Config.ClearCache)
                    delete require.cache[require.resolve(FilePath)]
                var x = require(FilePath)
                this.Connection.Request.StopTime = new Date().getTime()
                x[this.Config.PageEntryFunctionName](this.Connection);
            } catch (e) {
                if (this.Config.DisplayErrors)
                    this.Connection.Response.Body = e.stack;
                this.write();
            }
        } else {
            this.stream(Filepath);
        }
    } else {
        if (this.Connection.Response.Code == 404) {
            this.Connection.Response.Body += 'File Not Found: ' + FilePath
            this.write();
        }
    }
}
Response.prototype.stream = function(Filepath) {
    var self = this;
    var fstream = _FS.createReadStream(Filepath);
    fstream.pipe(this._RESPONSE);

    fstream.on('end', function() {
        self._RESPONSE.end();
    });

}


Response.prototype.write = function() {
    this._RESPONSE.setHeader('Set-Cookie', 'SessionID=' + this.Connection.SessionID + '; HttpOnly')
    // this._RESPONSE.setHeader('Set-Cookie', this.CookieManager.buildHeader())
    this._RESPONSE.writeHead(this.Connection.Response.Code, this.Connection.Response.Headers)
    if (typeof this.Connection.Response.Body == 'string')
        this._RESPONSE.write(this.Connection.Response.Body, this.Connection.Response.Encoding);
    else
        this._RESPONSE.write(JSON.stringify(this.Connection.Response.Body), this.Connection.Response.Encoding);
    if (typeof this.Config.OnResponseComplete == 'function')
        this.Config.OnResponseComplete(this)

    this._RESPONSE.end();
}

module.exports = Response;
