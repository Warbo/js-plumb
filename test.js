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
  return fails;
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

  'id': function(x) {
          var lhs = plumb([], x);
          return (lhs === x)? 0 : {'lhs': lhs, 'rhs': x};
        }
}));
