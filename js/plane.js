'use strict'

var Plane = function(ctx, x, y, dirDeg, options) {

    var self = this;

    this.X = x;
    this.Y = y;
    this.size = 45;
    this.airspaceCtx = ctx;

    this.selected = false;
    this.speed = 60;
    this.direction = dirDeg * Math.PI / 180; // deg to rad

    this.currentPath = [];

    this.resources = options.planeImages;
    this.type = options.type;
};

Plane.prototype.draw = function() {
    var cx = this.airspaceCtx;

    if(this.selected) {
        cx.fillStyle = "#ff0000";
    } else {
        cx.fillStyle = "#000";
    }
    //this.airspaceCtx.fillText("Im a plane!", this.X, this.Y, 50, 50);
    //cx.fillRect(this.X - this.size / 2, this.Y - this.size / 2, this.size, this.size);

    if(this.currentPath.length > 0) {
        cx.beginPath();
        cx.moveTo(this.X, this.Y);
        cx.lineWidth = 1;
        for(var i in this.currentPath) {
            var wp = this.currentPath[i];
            cx.lineTo(wp.X, wp.Y);
            //cx.strokeRect(wp.X-5, wp.Y-5, 10, 10);
        }
        cx.strokeStyle = "#555";
        cx.stroke();
    }

    if(this.resources[this.type].loaded) {
        cx.save();
        var a = 180 * Math.PI / 180;
        cx.translate(this.X, this.Y);
        cx.rotate(a - this.direction);
        cx.drawImage(this.resources[this.type].img, 0 - this.size/2, 0 - this.size/2, this.size, this.size);
        cx.restore();
    }
};

Plane.prototype.left = function() { return this.X - this.size / 2; }
Plane.prototype.right = function() { return this.X + this.size / 2; }
Plane.prototype.top = function() { return this.Y - this.size / 2; }
Plane.prototype.bottom = function() { return this.Y + this.size / 2; }

Plane.prototype.getDirection = function(originCoord, destCoord) {
    var xp = originCoord.X,
        yp = originCoord.Y,
        x = destCoord.X,
        y = destCoord.Y;

    var dir = Math.atan((yp - y)/(x - xp));

    if(x - xp < 0) dir += Math.PI;
    else if(yp - y < 0) dir += Math.PI * 2;

    return dir;
}

Plane.prototype.move = function() {

    if(this.currentPath.length > 0) {
        var nextWp = this.currentPath.slice(0,1)[0];

        this.direction = this.getDirection(
            { X: this.X, Y: this.Y },
            nextWp
        );
    }

    this.X += (this.speed / 60) * Math.cos(this.direction);
    this.Y -= (this.speed / 60) * Math.sin(this.direction);

    if(this.currentPath.length > 0 && this.isHereAccurate(nextWp.X, nextWp.Y)) {
        this.currentPath.shift();
    }
}

Plane.prototype.isHereAccurate = function(x, y) {
    return this.X - 3 <= x && this.X + 3 >= x
        && this.Y - 3 <= y && this.Y + 3 >= y;
}
Plane.prototype.isHere = function(x, y) {
    return this.left() <= x && this.right() >= x
        && this.top() <= y && this.bottom() >= y;
}

Plane.prototype.select = function () {
    this.currentPath = [];
    this.selected = true;
}

Plane.prototype.deselect = function() {
    this.selected = false;
}

Plane.prototype.addWaypoint = function(x, y) {

    var dir = this.currentPath.length > 0 ?
        this.getDirection(this.currentPath[this.currentPath.length - 1],
            {X: x, Y: y})
        : this.direction;

    this.currentPath.push({X: x, Y: y, dir: dir });
}