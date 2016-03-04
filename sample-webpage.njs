var counter = 0;
//If ClearCache is disabled in the server config, the counter increments on every pageview
exports.inlet = function(C) {
  counter++;
  C.Response.Body += '\r\n\r\n> Sessions\r\n\r\n'
  for (var variable in C.Data.Session)
    if (C.Data.Session.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Session[variable] + '\r\n';
  C.Response.Body += '\r\n\r\n> Get\r\n\r\n'
  for (var variable in C.Data.Get)
    if (C.Data.Get.hasOwnProperty(variable)){
      C.Response.Body += variable + ' = ' + C.Data.Get[variable] + '\r\n';
      C.Data.Session[variable] = C.Data.Get[variable]
    }
  C.Response.Body += '\r\n\r\n> Post\r\n\r\n'
  for (var variable in C.Data.Post)
    if (C.Data.Post.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Post[variable] + '\r\n';
  C.Response.Body += '\r\n\r\n> Cookie\r\n\r\n'
  for (var variable in C.Data.Cookie)
    if (C.Data.Cookie.hasOwnProperty(variable))
      C.Response.Body += variable + ' = ' + C.Data.Cookie[variable] + '\r\n';
  C.Response.Body += '\r\n\r\n> headers\r\n\r\n'
  for (var variable in C.Request.headers)
    if (C.Request.headers.hasOwnProperty(variable))
      C.Response.Body += '\r\n' + variable + ' = ' + C.Request.headers[variable];
  C.Response.Body += '\r\n\r\n> body\r\n\r\n'

  C.Response.Body += '\r\n\r\n> stats\r\n\r\n'
  C.Response.Body += 'TimeToInlet = ' + (C.Request.StopTime - C.Request.StartTime) + ' ms\r\n'
  C.Response.Body += 'RequestMethod = ' +  C.Request.method +  '\r\n'
  C.Response.Body += 'PageCounter = ' +  counter + '\r\n'
  C.Response.End();
}
