var webtc = require('webtc');
webtc.setDomainConfig({
  'Basepath': __dirname + '/webserver',
  'ClearCache': true,
  'IndexFileNames': ['default.njs', 'index.njs'],
  "MIMETypes": {
    "njs": "text/html"
  },
  'ExecutableFileExtensions': ['njs']
});
webtc.setDomainConfig({
  'Basepath': __dirname + '/webserver/example',
  'FileRewrites': {
    "^/this/": "/that/index.njs"
  }
}, 'www.example.com');
webtc.start();