'use strict'

var Plane = function (airspace, id, x, y, dirDeg, alt) {

    var self = this;
    this.id = id;
    this.sky = airspace.sky;
    this.airspace = airspace;

    this.speed = 35;
    this.altitude = alt;

    this.currentPath = [];

    this.body = this.sky.path("M19.671,8.11l-2.777,2.777l-3.837-0.861c0.362-0.505,0.916-1.683,0.464-2.135c-0.518-0.517-1.979,0.278-2.305,0.604l-0.913,0.913L7.614,8.804l-2.021,2.021l2.232,1.061l-0.082,0.082l1.701,1.701l0.688-0.687l3.164,1.504L9.571,18.21H6.413l-1.137,1.138l3.6,0.948l1.83,1.83l0.947,3.598l1.137-1.137V21.43l3.725-3.725l1.504,3.164l-0.687,0.687l1.702,1.701l0.081-0.081l1.062,2.231l2.02-2.02l-0.604-2.689l0.912-0.912c0.326-0.326,1.121-1.789,0.604-2.306c-0.452-0.452-1.63,0.101-2.135,0.464l-0.861-3.838l2.777-2.777c0.947-0.947,3.599-4.862,2.62-5.839C24.533,4.512,20.618,7.163,19.671,8.11z");
    //this.body = sky.ellipse(0,0,30,10);
    this.body.attr({fill: "#000", "stroke-width": 0 });

    var c = this.coords();
    this.ox = c.x;
    this.oy = c.y;
    this.oDir = -45;

    this.makeMove(x, y, dirDeg);

    this.body.drag(
        function(rx, ry, ax, ay) { this.addWaypoint(ax, ay); }, // move
        function() { this.select(); },  // start
        function() { this.deselect(); },    // end
        this,
        this,
        this
    );
};

Plane.prototype.makeMove = function(newX, newY, newDir) {
    this.X = -this.ox + newX;
    this.Y = -this.oy + newY;
    this.direction = -this.oDir - newDir;

    this.body.transform(Helper.t(this.X, this.Y) + Helper.r(this.direction));

    //console.log(newX, newY, newDir);
}

Plane.prototype.showBox = function(color) {
    var box = this.body.getBBox();
    this.sky.rect(box.x, box.y, box.width, box.height).attr({stroke: color});
    this.body.clone().attr({fill: color});
}

Plane.prototype.coords = function() {
    var box = this.body.getBBox();
    return {
        x: box.x + box.width/2,
        y: box.y + box.height/2
    }
}

Plane.prototype.move = function() {
    var c = this.coords();

    var ndir = -(this.oDir + this.direction),
        nx = this.ox + this.X,
        ny = this.oy + this.Y;

    if(this.currentPath.length > 0) {
        var nextWp = this.currentPath.slice(0,1)[0];

        if(this.body.isPointInside(nextWp.x, nextWp.y)) {
            nextWp.body.remove();
            this.currentPath.shift();
            nextWp = this.currentPath.slice(0,1)[0];

        } else {

            var dir = Helper.getDirectionDeg(
                {x: nx,y: ny},
                nextWp
            );

            if(!nextWp.headingTo) {
                ndir = dir;
            }

            nextWp.headingTo = true;
        }
    }

    nx += (this.speed / this.sky.FS) * Math.cos(ndir * Math.PI / 180);
    ny -= (this.speed / this.sky.FS) * Math.sin(ndir * Math.PI / 180);

    //if(nx + 5 > this.sky.width || nx - 5 < 0) ndir = 180 - ndir;
    //if(ny + 5 > this.sky.height || ny - 5 < 0) ndir = -ndir;
    if(nx - 15 > this.sky.width || nx + 15 < 0
        || ny - 15 > this.sky.height || ny + 15 < 0) this.outOfControl();

    this.makeMove(nx, ny, ndir);
};

Plane.prototype.outOfControl = function() {
    console.log("out of control: " + this.id);
    this.body.remove();
    this.airspace.removePlane(this);
};

Plane.prototype.isHereAccurate = function(x, y) {
    return this.X - 3 <= x && this.X + 3 >= x
        && this.Y - 3 <= y && this.Y + 3 >= y;
};

Plane.prototype.isHere = function(x, y) {
    return this.left() <= x && this.right() >= x
        && this.top() <= y && this.bottom() >= y;
};

Plane.prototype.select = function () {
    for(var wp in this.currentPath) {
        this.currentPath[wp].body.remove();
    }
    this.currentPath = [];
    this.body.attr({fill: "#f00"});
};

Plane.prototype.deselect = function() {
    this.body.attr({fill: "#666"});
};

Plane.prototype.addWaypoint = function(ax, ay) {

    if(this.goneTooFar || ax + 5 > this.sky.width || ax - 5 < 0
        || ay + 5 > this.sky.height || ay - 5 < 0) { this.deselect(); this.goneTooFar = true; return; }

    var wp = this.sky.circle(ax, ay, 3).attr({stroke: "#aaa"});

    this.currentPath.push({x: ax, y: ay, body: wp, headingTo: false});
};