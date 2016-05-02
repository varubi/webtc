var _FS = require('fs'),
    CONFIG_SITE_TEMPLATE = require('./configurations/site-template.json'),
    CONFIG_SITE_DEFAULTS = require('./configurations/site-defaults.json'),
    CONFIG_SERVER_TEMPLATE = require('./configurations/server-template.json'),
    CONFIG_SERVER_DEFAULTS = require('./configurations/server-defaults.json')

function Configuration() {
    this.ServerConfig = CONFIG_SERVER_DEFAULTS;
    this.GlobalConfig = CONFIG_SITE_DEFAULTS;
    this.DomainConfig = [];
}
Configuration.prototype.setServerConfig = function(Config) {
    this.ServerConfig = this.merge(CONFIG_SERVER_TEMPLATE, this.ServerConfig, Config)
}
Configuration.prototype.setGlobalConfig = function(Config) {
    this.GlobalConfig = this.merge(CONFIG_SITE_TEMPLATE, this.GlobalConfig, Config)
}
Configuration.prototype.setDomainConfig = function(Config, DomainName, TemplateDomainName) {
    var i = this.getDomainConfigIndex(DomainName) || this.DomainConfig.length

    var templateConfig = this.DomainConfig[this.getDomainConfigIndex(TemplateDomainName)] || this.GlobalConfig

    this.DomainConfig[i] = this.merge(CONFIG_SITE_TEMPLATE, templateConfig, Config)
    this.DomainConfig[i].DomainValidator = DomainName
}
Configuration.prototype.getConfig = function(DomainName) {
    for (var i = 0; i < this.DomainConfig.length; i++)
        if ((new RegExp(this.DomainConfig[i].DomainValidator)).test(DomainName))
            return this.DomainConfig[i]
    return this.GlobalConfig
}
Configuration.prototype.merge = function(Template, Config1, Config2) {
    return this.mergeMethods.object(Template, Config1, Config2)
}
Configuration.prototype.getDomainConfigIndex = function(DomainName) {
    if (typeof DomainName === 'string')
        for (var i = 0; i < this.DomainConfig.length; i++)
            if (this.DomainConfig[i].DomainValidator == DomainName)
                return i
    return null
}
Configuration.prototype.mergeMethods = {
    'array': function(template, ary1, ary2) {
        var r = []
        var ary = [];
        var templatetype = this.getTemplateType(template[0])

        if (Array.isArray(ary2))
            ary = ary2
        else if (Array.isArray(ary1))
            ary = ary1

        for (var i = 0; i < ary.length; i++)
            if (templatetype == this.getType(ary[i])) {
                var item = this[templatetype](template[0], ary[i], null)
                if (item !== null)
                    r.push(item)
            }

        if (r.length == 0)
            return null
        return r
    },
    'object': function(template, obj1, obj2) {
        var r = {}
        if (this.getType(obj1) !== 'object' || obj1 === null || obj1 === undefined)
            obj1 = {}
        if (this.getType(obj2) !== 'object' || obj2 === null || obj2 === undefined)
            obj2 = {}
        var a1 = Object.keys(obj1).length
        var a2 = Object.keys(obj2).length
        if (Object.keys(obj1).length + Object.keys(obj2).length === 0)
            return null
        var firstTemplateKey = Object.keys(template)[0]
        if (firstTemplateKey.substring(0, 1) == '*') {
            var templatetype = this.getTemplateType(template[firstTemplateKey]);
            for (var variable in obj2)
                if (this.getType(obj2[variable]) == templatetype)
                    r[variable] = this[templatetype](template[firstTemplateKey], obj1[variable], obj2[variable])
            for (var variable in obj1)
                if (this.getType(obj1[variable]) == templatetype && !obj2.hasOwnProperty(variable))
                    r[variable] = this[templatetype](template[firstTemplateKey], obj1[variable], obj2[variable])
        } else
            for (var variable in template) {
                var templatetype = this.getTemplateType(template[variable]);
                r[variable] = this[templatetype](template[variable], obj1[variable], obj2[variable])
            }
        if (Object.keys(r).length === 0)
            return null
        return r
    },
    'string': function(template, string1, string2) {
        return this.returnMatch(template, string1, string2)
    },
    'number': function(template, number1, number2) {
        return this.returnMatch(template, number1, number2)
    },
    'boolean': function(template, boolean1, boolean2) {
        return this.returnMatch(template, boolean1, boolean2)
    },
    'function': function(template, function1, function2) {
        return this.returnMatch(template, function1, function2)
    },
    'filepath': function(template, path1, path2) {
        if (_FS.statSync(path2).isFile())
            return path2
        if (_FS.statSync(path1).isFile())
            return path1
        return null
    },
    'directorypath': function(template, path1, path2) {
        if (_FS.statSync(path2).isDirectory())
            return path2
        if (_FS.statSync(path1).isDirectory())
            return path1
        return null
    },
    'regex': function(template, regex1, regex2) {
        if (regex2 instanceof RegExp)
            return regex2
        if (regex1 instanceof RegExp)
            return regex1
        return null

    },
    'returnMatch': function(template, variable1, variable2) {
        if (this.getTemplateType(template) == this.getType(variable2))
            return variable2
        if (this.getTemplateType(template) == this.getType(variable1))
            return variable1
        return null
    },
    'getType': function(obj) {
        if (Array.isArray(obj))
            return 'array'
        else
            return typeof obj
    },
    'getTemplateType': function(obj) {
        if (Array.isArray(obj))
            return 'array'
        else if (typeof obj == 'string' && obj.substring(0, 1) == '_')
            return obj.substr(1)
        return typeof obj
    }
}
module.exports = Configuration;
