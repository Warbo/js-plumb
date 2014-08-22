(function(exports) {

  function as_array(x) { return Array.prototype.slice.call(x, 0); }

  exports._ = function __() {
                var args = as_array(arguments);
                args.grouped = true;
                return args;
              };

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

  var interpret;

  var call = curry(function call_(env, f, arg) {
                     return op(f, interpret(env, arg));
                   });

  var chain = curry(function chain_(env, calls) {
                      return calls.reduce(call(env),
                                          function(x) { return x; });
                    });

  var plumb = curry(function plumb_(env, expr, arg) {
                      return expr? chain([arg].concat(env), expr)
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

})(typeof exports === 'undefined'? this['mymodule']={}: exports);
