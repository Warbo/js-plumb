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
  'args': function(x, y, z) {
            return (0 <= x &&
                    0 <= y &&
                    0 <= z &&
                    x <= 1000 &&
                    y <= 1000 &&
                    z <= 1000)? 0 : {'x': x, 'y': y, 'z': z};
          },

  'id': function(rhs) {
          var lhs = plumb([], rhs);
          return (lhs === rhs)? 0 : {'lhs': lhs, 'rhs': rhs};
        },

  'id2': function(rhs) {
           var lhs = plumb([0], rhs);
           return (lhs === rhs)? 0 : {'lhs': lhs, 'rhs': rhs};
         },

  'plumb uncurries': function(x) {
                       var id  = plumb([]);
                       var lhs = plumb([id , 0], x);
                       return (lhs === x)? 0 : {'lhs': lhs, 'rhs': x};
                     },

  'group syntax works': function(x) {
                          function p(a, b) { return a + b; };
                          function m(a, b) { return a * b; };
                          var lhs = plumb([p , 0 , _(m , 0 , 0)], x);
                          var rhs = x + (x * x);
                          return (lhs === rhs)? 0 : {'lhs': lhs,
                                                     'rhs': rhs,
                                                     'x':   x};
                        }
}));
