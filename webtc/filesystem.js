var _FS = require('fs');
var _URL = require('url')

function FileManagement(CONFIG) {
  this.Cache = {}
  this.FileInfo = {};
  this.Config = CONFIG;
}
FileManagement.prototype.ResolveFile = function(BASEPATH, CALLBACK) {
  var self = this;
  new FileResolution(self, BASEPATH, CALLBACK);
};
FileManagement.prototype.ResolveURL = function(URL) {
  var self = this;
  var r = URL;
  for (var key in this.Config.FileRewrites)
    if (this.Config.FileRewrites.hasOwnProperty(key))
      if ((new RegExp(key)).test(URL)) {
        r = URL.replace(new RegExp(key), this.Config.FileRewrites[key]);
        break;
      }
  var parsed = _URL.parse(r, true)
  return parsed;
}

function FileResolution(FILEMANAGER, BASEPATH, CALLBACK) {
  this.FileManager = FILEMANAGER;
  this.Basepath = BASEPATH;
  this.TestedPath = BASEPATH;
  this.Callback = CALLBACK;
  this.IndexFileNamesCounter = 0;
  this.isDirectory = false;
  var self = this;
  _FS.stat(this.Basepath, function(err, stats) {
    self.ResolveCallback(err, stats)
  })
}
FileResolution.prototype.ResolveCallback = function(err, stats) {
  var self = this;
  if (err) {
    if (!this.isDirectory) {
      this.Callback(404, this.TestedPath)
    } else {
      if (this.IndexFileNamesCounter + 1 < this.FileManager.Config.IndexFileNames.length) {
        this.IndexFileNamesCounter++;
        this.TestedPath = this.Basepath + '/' + this.FileManager.Config.IndexFileNames[this.IndexFileNamesCounter]
        _FS.stat(this.TestedPath, function(err, stats) {
          self.ResolveCallback(err, stats)
        })
      } else {
        this.Callback(404, this.TestedPath)
      }
    }
  } else {
    if (stats.isFile())
      this.Callback(200, this.TestedPath)
    if (stats.isDirectory()) {
      this.isDirectory = true;
      if (this.FileManager.Config.IndexFileNames.length > 0) {
        this.TestedPath = this.Basepath + '/' + this.FileManager.Config.IndexFileNames[this.IndexFileNamesCounter]
        _FS.stat(this.TestedPath, function(err, stats) {
          self.ResolveCallback(err, stats)
        })
      } else {
        this.Callback(404, this.TestedPath)
      }
    }
  }
}

function FileInfo() {
  this.FirstAccess = new Date();
  this.LastAccess = new Date();

}

module.exports = FileManagement;
