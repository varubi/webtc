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
