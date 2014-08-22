(function(exports) {

  // Helper functions

  function as_array(x) { return Array.prototype.slice.call(x, 0); }

  function call(f, x) { return f(x); }

  function curry_(args, n, f) {
    return (args.length < n)? function curried() {
                                return curry_(args.concat(as_array(arguments)),
                                              n,
                                              f);
                              }
                            : args.slice(n)
                                  .reduce(call,
                                          f.apply(null, args.slice(0, n)));
  }

  var curry = curry_([], 1, function curry(f) {
                              return curry_([], f.length, f);
                            });

  // Plumb

  var interpret;

  var icall = curry(function icall_(env, f, arg) {
                     return curry(f, interpret(env, arg));
                   });

  var chain = curry(function chain_(env, calls) {
                      return calls.reduce(
                               function(f, x) { return icall(env, f, x); },
                               function(x)    { return x; });
                    });

  var plumb = curry(function plumb_(env, expr, arg) {
                      return expr.length? chain([arg].concat(env), expr)
                                        : arg;
                    });

  function is_array(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  }

  interpret = curry(function interpret(e, x) {
                      // Assume ints and arrays are Plumb; anything else is JS
                      if (typeof(x) === typeof(0)) return e[x];
                      if (is_array(x)) return x.grouped? chain(e, x)
                                                       : plumb(e, x);
                      return x;
                    });

  exports.plumb = plumb([]);

  exports._ = function __() {
                var args = as_array(arguments);
                args.grouped = true;
                return args;
              };

// If 'exports' is defined, we're in a CommonJS module (eg. in Node.js),
// otherwise we're in a browser so define a 'plumb' object
})(typeof exports === 'undefined'? this['plumb']={} : exports);
