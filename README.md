# Web Traffic Controller (WEBTC)
Web Traffic Controller an HTTP server for Node.js. An easily configurable web server.

# Features
* URL rewriting
* Cache prevention for development enviroments
* Session data
* POST and GET data
* Cookies
* Apache DocumentRoot for VirtualHost capabilities. DomainPaths variable

# ToDo
* Better documentation (or documentation to start with...)
* Option for session data stored to file
* A whole bunch of code optimizations
* File uploads

#Sample Code
####/var/nodejs/server.js
```javascript
var webtc = require('webtc');
webtc.setConfig({
  'Basepath': __dirname + '/webserver',
  'DomainPaths':{
    'www.example.com': __dirname + '/webserver/example1',
    'www2.example.com': __dirname + '/webserver/example2',
    'www.example2.com': __dirname + '/webserver/example3',
  },
  'ClearCache': true,
  'IndexFileNames': ['default.njs', 'index.njs'],
  "MIMETypes": {
    "njs": "text/html"
  },
  'ExecutableFileExtensions': ['njs'],
  "FileRewrites": {
    "^/thispage(?=(.*))$": "/fiddle?fiddle=$1&$2"
  }
});
webtc.listen(80);
```
####/var/nodejs/webserver/default.njs
```javascript
var counter = 0;
//If ClearCache is disabled in the config, the counter increments on every pageview
exports.response = function(C) {
  counter++;
  C.Response.Body += '<br /><br />> Sessions<br />'
  C.Response.Body += print_Obj(C.Data.Session)
  C.Response.Body += '<br /><br />> Get<br />'
  C.Response.Body += print_Obj(C.Data.Get)
  C.Response.Body += '<br /><br />> Post<br />'
  C.Response.Body += print_Obj(C.Data.Post)
  C.Response.Body += '<br /><br />> Cookie<br />'
  C.Response.Body += print_Obj(C.Data.Cookie)
  C.Response.Body += '<br /><br />> Headers<br />'
  C.Response.Body += print_Obj(C.Request.headers)
  C.Response.Body += '<br /><br />> stats<br />'
  C.Response.Body += 'TimeToInlet = ' + (C.Request.StopTime - C.Request.StartTime) + ' ms<br />'
  C.Response.Body += 'RequestMethod = ' + C.Request.method + '<br />'
  C.Response.Body += 'PageCounter = ' + counter + '<br />'
  C.Response.End();
}

var print_Obj = function(obj) {
  var string = ""
  for (var variable in obj)
    if (obj.hasOwnProperty(variable))
      string += variable + ' = ' + obj[variable] + '<br />';
  return string;
}


```
