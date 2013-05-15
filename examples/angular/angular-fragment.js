/**
 * Registers a `listener` callback to be executed whenever the `watchExpression` changes.
 *
 * - The `watchExpression` is called on every call to {@link ng.$rootScope.Scope#$digest $digest()} and
 *   should return the value which will be watched. (Since {@link ng.$rootScope.Scope#$digest $digest()}
 *   reruns when it detects changes the `watchExpression` can execute multiple times per
 *   {@link ng.$rootScope.Scope#$digest $digest()} and should be idempotent.)
 * - The `listener` is called only when the value from the current `watchExpression` and the
 *   previous call to `watchExpression` are not equal (with the exception of the initial run,
 *   see below). The inequality is determined according to
 *   {@link angular.equals} function. To save the value of the object for later comparison, the
 *   {@link angular.copy} function is used. It also means that watching complex options will
 *   have adverse memory and performance implications.
 * - The watch `listener` may change the model, which may trigger other `listener`s to fire. This
 *   is achieved by rerunning the watchers until no changes are detected. The rerun iteration
 *   limit is 10 to prevent an infinite loop deadlock.
 *
 *
 * If you want to be notified whenever {@link ng.$rootScope.Scope#$digest $digest} is called,
 * you can register a `watchExpression` function with no `listener`. (Since `watchExpression`
 * can execute multiple times per {@link ng.$rootScope.Scope#$digest $digest} cycle when a change is
 * detected, be prepared for multiple calls to your listener.)
 *
 * After a watcher is registered with the scope, the `listener` fn is called asynchronously
 * (via {@link ng.$rootScope.Scope#$evalAsync $evalAsync}) to initialize the
 * watcher. In rare cases, this is undesirable because the listener is called when the result
 * of `watchExpression` didn't change. To detect this scenario within the `listener` fn, you
 * can compare the `newVal` and `oldVal`. If these two values are identical (`===`) then the
 * listener was called due to initialization.
 *
 *
 * @function $watch
 */
function $watch(watchExp, listener, objectEquality) {
  var scope = this,
  get = compileToFn(watchExp, 'watch'),
  array = scope.$$watchers,
  watcher = {
    fn: listener,
    last: initWatchVal,
    get: get,
    exp: watchExp,
    eq: !!objectEquality
  };

  // in the case user pass string, we need to compile it, do we really need this ?
  if (!isFunction(listener)) {
    var listenFn = compileToFn(listener || noop, 'listener');
    watcher.fn = function(newVal, oldVal, scope) {listenFn(scope);};
  }

  if (typeof watchExp == 'string' && get.constant) {
    var originalFn = watcher.fn;
    watcher.fn = function(newVal, oldVal, scope) {
      originalFn.call(this, newVal, oldVal, scope);
      arrayRemove(array, watcher);
    };
  }

  if (!array) {
    array = scope.$$watchers = [];
  }
  // we use unshift since we use a while loop in $digest for speed.
  // the while loop reads in reverse order.
  array.unshift(watcher);

  return function() {
    arrayRemove(array, watcher);
  };
}