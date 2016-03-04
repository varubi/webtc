var webtc = require('webtc');
webtc.setConfig({
  'Basepath': __dirname + '/webserver',
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
