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
