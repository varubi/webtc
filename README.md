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
//If ClearCache is disabled in the counter increments on every pageview
exports.inlet = function(C) {
  counter++;
  C.Response.Body += '<br /><br />> Sessions<br />'
  for (var variable in C.Data.Session)
    if (C.Data.Session.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Session[variable] + '<br />';
  C.Response.Body += '<br /><br />> Get<br />'
  for (var variable in C.Data.Get)
    if (C.Data.Get.hasOwnProperty(variable)){
      C.Response.Body += variable + ' = ' + C.Data.Get[variable] + '<br />';
      C.Data.Session[variable] = C.Data.Get[variable]
    }
  C.Response.Body += '<br /><br />> Post<br />'
  for (var variable in C.Data.Post)
    if (C.Data.Post.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Post[variable] + '<br />';
  C.Response.Body += '<br /><br />> Cookie<br />'
  for (var variable in C.Data.Cookie)
    if (C.Data.Cookie.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Cookie[variable] + '<br />';
  C.Response.Body += '<br /><br />> headers<br />'
  for (var variable in C.Request.headers)
    if (C.Request.headers.hasOwnProperty(variable))
      C.Response.Body += '<br />' + variable + ' = ' + C.Request.headers[variable];
  C.Response.Body += '<br /><br />> body<br /><br />'

  C.Response.Body += '<br /><br />> stats<br />'
  C.Response.Body += 'TimeToInlet = ' + (C.Request.StopTime - C.Request.StartTime) + ' ms<br />'
  C.Response.Body += 'RequestMethod = ' +  C.Request.method +  '<br />'
  C.Response.Body += 'PageCounter = ' +  counter + '<br />'
  C.Response.End();
}

```
