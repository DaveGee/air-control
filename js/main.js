
$(document).ready(function() {

    var canvas = document.getElementById("airspace");
    var ctx = canvas.getContext("2d");

    window.resources = new Resources();

    window.airspace = new Airspace(window, ctx, canvas.width, canvas.height);
    window.airspace.resources = window.resources;

    window.airspace.addPlane(100, 100, 0, "Fighter");
    //window.airspace.addPlane(300, 50, -60);
    //window.airspace.addPlane(100, 100, -30);

    canvas.addEventListener("mousedown", function(evt) { window.airspace.beginRoute(evt); }, false);
    canvas.addEventListener("mouseup", function(evt) { window.airspace.endRoute(evt); }, false);
    canvas.addEventListener("mousemove", function(evt) { window.airspace.trace(evt); }, false);

});


function throttle(fn, threshold, scope) {
    threshold || (threshold = 250);
    var last, deferTime;

    return function() {
        var context = scope || this;

        var now = +new Date(), args = arguments;

        // not 1st execution, and last time was a longer time ago of at least 'threshold' (long enough...)
        if(last && now < last + threshold) {
            // hold it
            clearTimeout(deferTime);
            deferTime = setTimeout(function() {
                last = now;
                fn.apply(context, args);
            }, threshold);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}