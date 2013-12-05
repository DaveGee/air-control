
var Airspace = function(window, ctx, w, h) {

    if(arguments.callee._singletonInstance)
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;

    this.planes = [];
    this.width = w;
    this.height = h;
    this.ctx = ctx;

    this.selectedPlane = null;

    this.resources = null;

    var self = this;

    function refresh () {
        this.ctx.clearRect(0,0,this.width, this.height);

        for(var p in this.planes) {
            this.planes[p].move();
            this.planes[p].draw();
        }
    }

    window.setInterval(function() {
        refresh.apply(self);
    }, 1000/60);



    this.addPlane = function(x, y, dir, type) {
        this.planes.push(new Plane(this.ctx, x, y, dir, {
            planeImages: this.resources.planes,
            type: type
        }));
    }

    this.beginRoute = function(evt) {
        for(var p in this.planes) {
            var plane = this.planes[p];
            if(plane.isHere(evt.offsetX, evt.offsetY)) {
                plane.select();
                this.selectedPlane = plane;
            }
        }
    }

    this.endRoute = function(evt) {
        if(this.selectedPlane) {
            this.selectedPlane.deselect();
            this.selectedPlane = null;
        }
    }

    this.trace = function(evt) {
        if(this.selectedPlane) {
            this.selectedPlane.addWaypoint(evt.offsetX, evt.offsetY);
        }
    }

}