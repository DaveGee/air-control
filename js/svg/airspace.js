
var Airspace = function(window, sky, w, h) {

    if(arguments.callee._singletonInstance)
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this.planes = [];
    this.width = w;
    this.height = h;
    this.sky = sky;
    this.sky.FS = 60;

    this.selectedPlane = null;

    this.process = null;
    this.planeIds = 0;

    var self = this;

    function refresh () {
        if(this.planes.length == 0) {
            this.pause();
        }

        for(var p in this.planes) {
            this.planes[p].move();
        }
    }

    this.pause = function() {
        window.clearInterval(this.process);
        this.process = null;
    };

    this.start = function() {
        this.process = window.setInterval(function() {
            refresh.apply(self);
        }, 1000/this.sky.FS);
    };

    this.addPlane = function(x, y, dir, alt) {
        this.planes.push(new Plane(this, this.planeIds++, x, y, dir, alt));
        if(!this.process) {
            this.start();
        }
    };

    this.removePlane = function(plane) {
        for(var i in this.planes) {
            if(this.planes[i].id == plane.id) {
                this.planes.splice(i,  1);
            }
        }
    };

    this.beginRoute = function(evt) {
        for(var p in this.planes) {
            var plane = this.planes[p];
            if(plane.isHere(evt.offsetX, evt.offsetY)) {
                plane.select();
                this.selectedPlane = plane;
            }
        }
    };

    this.endRoute = function(evt) {
        if(this.selectedPlane) {
            this.selectedPlane.deselect();
            this.selectedPlane = null;
        }
    };

    this.trace = function(evt) {
        if(this.selectedPlane) {
            this.selectedPlane.addWaypoint(evt.offsetX, evt.offsetY);
        }
    };
};