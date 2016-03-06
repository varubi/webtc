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