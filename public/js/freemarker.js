var freemarker = {
  symbols: {
    'replace': {
      start: '${', end: '}', process: function (parts, cmd) {
        parts.push(freemarker._p(cmd));
      }
    },
    'if': {
      start: '<#if', end: '>', process: function (parts, cmd) {
        if (cmd.indexOf('??') >= 0) {
          var expr = cmd.substring(0, cmd.length - 2);
          expr = freemarker._v(expr);
          parts.push("if (" + expr + ") {");
        } else if (cmd.indexOf('?size') >= 0) {
          var pos = cmd.indexOf('?size');
          var expr = freemarker._v(cmd.substring(0, pos)) + '.length'
              + cmd.substring(pos + 5);
          parts.push("if (" + expr + ") {");
        } else {
          parts.push("if (" + cmd + ") {");
        }
      }
    },
    'endif': {
      start: '</#if', end: '>', process: function (parts, cmd) {
        parts.push("}");
      }
    },
    'else': {
      start: '<#else', end: '>', process: function (parts, cmd) {
        parts.push("} else {");
      }
    },
    'list': {
      start: '<#list', end: '>', process: function (parts, cmd) {
        // <#list envelopes as envelope >
        var match = cmd.match(/\s*(\S*)\s*as\s*(\S*)\s*/);
        if (match) {
          parts.push("for (var " + match[2] + "_index in " + freemarker._v(
              match[1]) + ")");
        }
        parts.push("{");
        if (match) {
          parts.push(freemarker._v(match[2]) + "=" + freemarker._v(match[1])
              + "[" + match[2] + "_index];");
        }
      }
    },
    'endlist': {
      start: '</#list', end: '>', process: function (parts, cmd) {
        parts.push("}");
      }
    }
  },
  _o: function (cmd) {
    return "p.push(\"" + escape(cmd) + "\");";
  },
  _p: function (cmd) {
    return "p.push(" + freemarker._v(cmd, true) + ");";
  },
  _d: function (cmd) {
    return "console.debug(this, \"" + escape(cmd) + "\");";
  },
  _v: function (name, out) {
    return out ? 'this._fm_out(this.' + name + ')' : 'this.' + name;
  },
  _setlocalvarscode: function (obj) {
    var buf = [];
    buf.push("this._vars={};");
    for (var p in obj) {
      buf.push("this._vars.", p, " = this['", p, "'];\n");
    }
    return buf.join('');
  },
  nextToken: function (template, pos) {
    var newPos;
    var endPos;
    var found = {};
    for (var i in this.symbols) {
      var symbol = this.symbols[i];
      var n = template.indexOf(symbol.start, pos);
      if (n >= 0 && (!found.symbol || n < found.newPos)) {
        var e = template.indexOf(symbol.end, n);
        if (e >= 0) {
          found.newPos = n;
          found.endPos = e;
          found.start = n + symbol.start.length;
          found.symbol = symbol;
        }
      }
    }
    return found;
  },
  create: function (template) {
    var parts = [];
    parts.push("var p=[];");
    var pos = 0;
    while (pos >= 0) {
      var token = this.nextToken(template, pos);
      if (!token.symbol) {
        parts.push(this._o(template.substring(pos)));
        break;
      }
      parts.push(this._o(template.substring(pos, token.newPos)));
      if (token.symbol.process) {
        token.symbol.process(parts,
            template.substring(token.start, token.endPos));
      }

      pos = token.endPos + 1;
    }
    parts.push("this._out = unescape(p.join(''));");

    var engine = {
      compiled: parts.join(''),
      template: template
    };
    //console.debug(parts.join('\n'));
    return engine;
  },

  render: function (engine, context) {
    if (typeof engine == "string" || engine instanceof String) {
      engine = this.create(engine);
    }
    context = context || {};
    context._fm_out = function (val) {
      if (typeof val == 'object') {
        if (typeof val._render == 'function') {
          return val._render();
        } else if (val[0]) {
          return val[0];
        }
      }

      return val;
    };
    var vars = this._setlocalvarscode(context);
    //(function(){eval(vars+engine.compiled);}).call(context);
    (function () {
      eval(engine.compiled);
    }).call(context);
    return context._out;
  }
}; 
