var mod = require('./plumb.js');
var plumb = mod.plumb;
var _ = mod._;

function args(n) {
  return Array.apply(null, {length: n})
              .map(function() { return Math.round(Math.random() * 1000); });
}

function failures(o) {
  var fails = {};
  Object.keys(o).map(function(k) {
                       var result = o[k].apply(null, args(o[k].length));
                       if (result) fails[k] = result;
                     });
  return Object.keys(fails).length? fails : 'All tests passed';
}

console.log(failures({
  'test arguments are provided': function(x, y, z) {
    if (x < 0    ||
        y < 0    ||
        z < 0    ||
        x > 1000 ||
        y > 1000 ||
        z > 1000) return {'x': x, 'y': y, 'z': z};
  },

  '[] is id function': function id1(rhs) {
    var lhs = plumb([], rhs);
    if (lhs !== rhs) return {'lhs': lhs, 'rhs': rhs};
  },

  '[0] is id function': function id2(rhs) {
    var lhs = plumb([0], rhs);
    if (lhs !== rhs) return {'lhs': lhs, 'rhs': rhs};
  },

  'plumb curries the functions it applies': function plumb_curries(x, y) {
    var f = function(a, b) { return a + b; };
    var lhs = plumb([[f , 1 , 0]], x, y);
    if (lhs !== x + y) return {'lhs': lhs, 'x': x, 'y': y};
  },

  'plumb uncurries return values': function plumb_uncurries(x) {
    var id  = plumb([]);
    var lhs = plumb([id , 0], x);
    return (lhs === x)? 0 : {'lhs': lhs, 'rhs': x};
  },

  'group syntax works': function group_syntax(x) {
    function p(a, b) { return a + b; };
    function m(a, b) { return a * b; };
    var lhs = plumb([p , 0 , _(m , 0 , 0)], x);
    var rhs = x + (x * x);
    return (lhs === rhs)? 0 : {'lhs': lhs, 'rhs': rhs, 'x': x};
  }
}));
