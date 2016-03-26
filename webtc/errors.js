ErrorHandler = function(CONFIG) {
  this.Config = CONFIG;
}

ErrorHandler.prototype.Log = function(CONNECTION) {
  if (this.Config.DisplayErrors && (400,200).indexOf(CONNECTION.Response.Code) != 0) {

  }
}
module.exports = ErrorHandler;
