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
  'URLRewrites': [{
    'Filter': /only-match-urls-that-look-like-this/,
    'Match': /replace-this-part-of-the-url/,
    'Replace': "with-this-string"
  }]
}, 'www.example.com');
webtc.start();
