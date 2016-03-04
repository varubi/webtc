function CookieManagement() {
  this.Cookies = [];
}

CookieManagement.prototype.setCookie = function(Name, Value, Domain, Path, Expires, MaxAge, Secure, HttpOnly) {
  var cookie = {}
  cookie['Name'] = Name.trim()
  cookie['Value'] = Value.trim()
  cookie['Domain'] = ''
  cookie['Path'] = ''
  cookie['Expires'] = ''
  cookie['Max-Age'] = ''
  if (typeof Domain === 'string')
    cookie['Domain'] = Domain
  if (typeof Path === 'string')
    cookie['Path'] = Path
  if (typeof Expires === 'string')
    cookie['Expires'] = Expires
  if (typeof Expires === 'string')
    cookie['Expires'] = Expires
  if (typeof Expires === 'object' && typeof Expires.toUTCString === 'function')
    cookie['Expires'] = Expires.toUTCString()
  if (typeof MaxAge === 'string' || typeof MaxAge === 'number')
    cookie['Max-Age'] = MaxAge.toString()
  cookie['Secure'] = (!Secure || Secure === "false" ? false : true)
  cookie['HttpOnly'] = (!HttpOnly || HttpOnly === "false" ? false : true)
  return this.Cookies.push(cookie) - 1;
}
CookieManagement.prototype.parseCookie = function(Cookie) {
  if (typeof Cookie !== 'string' || Cookie == '')
    return {}
  var returnValue = {}
  var cookieAry = Cookie.split(';')
  for (var i = 0; i < cookieAry.length; i++) {
    var delimiterIndex = cookieAry[i].indexOf('=')
    var key = cookieAry[i].substring(0, delimiterIndex).trim();
    var value = cookieAry[i].substring(delimiterIndex + 1);
    if (!returnValue.hasOwnProperty(key))
      returnValue[key] = value
      }
  return returnValue;
}

CookieManagement.prototype.buildHeader = function() {
  var cookieAry = [];
  for (var i = 0; i < this.Cookies.length; i++) {
    var cookie =
      this.Cookies[i].Name + '=' + this.Cookies[i].Value +
      (this.Cookies[i]['Domain'] != '' ? '; domain=' +
        this.Cookies[i].Domain : '') +
      (this.Cookies[i]['Path'] != '' ? '; path=' +
        this.Cookies[i].Path : '') +
      (this.Cookies[i]['Expires'] != '' ? '; expires=' +
        this.Cookies[i].Expires : '') +
      (this.Cookies[i]['Max-Age'] != '' ? '; Max-Age=' +
        this.Cookies[i]['Max-Age'] : '') +
      (this.Cookies[i]['Secure'] ? '; Secure' : '') +
      (this.Cookies[i]['HttpOnly'] ? '; HttpOnly' : '')
    cookieAry.push(cookie)
    console.log(cookie);
  }
  return cookieAry;
};

module.exports = CookieManagement;
