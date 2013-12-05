
var Helper = {
    t: function(x, y) {return "t" + x + "," + y; },
    T: function(x, y) {return "T" + x + "," + y; },
    r: function(a, x, y) {return "r" + a + (x? "," + x + "," + y : ""); },
    R: function(a) {return "R" + a; },
    s: function(r) {return "s" + r; },
    S: function(r) {return "R" + r; },

    debug: function() {
        $("#debug").html("");
        for(var a in arguments) {
            $("#debug").html(
                $("#debug").html()
                + "<br />"
                + arguments[a]
            );
        }
    },

    getDirectionDeg: function(originCoord, destCoord) {
        var xp = originCoord.x,
            yp = originCoord.y,
            x = destCoord.x,
            y = destCoord.y;

        var dir = Math.atan((yp - y)/(x - xp));

        if(x - xp < 0) dir += Math.PI;
        else if(yp - y < 0) dir += Math.PI * 2;

        return dir * 180 / Math.PI;
    }
}