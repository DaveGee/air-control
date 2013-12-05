// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

(function(window) {
    var __nativeST__ = window.setTimeout, __nativeSI__ = window.setInterval;

    window.setScopedTimeout = function(oScope, vCallback, nDelay /* arguments */) {
        var oThis = oScope, aArgs = Array.prototype.slice.call(arguments, 2);
        return __nativeST__(vCallback instanceof Function ? function() {
            vCallback.apply(oThis, aArgs);
        } : vCallback, nDelay);
    }

    window.setScopedInterval = function(oScope, vCallback, nDelay /* arguments */) {
        var oThis = oScope, aArgs = Array.prototype.slice.call(arguments, 2);
        return __nativeSI__(vCallback instanceof Function ? function() {
            vCallback.apply(oThis, aArgs);
        } : vCallback, nDelay);
    }
}(window));