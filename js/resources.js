



var Resources = function(){
    var self = this;
    this.planes = {
        "Fighter": {
            loaded: false,
            src: "img/fighterjet.png"
        }
    };

    for(var r in this.planes) {
        this.planes[r].img = new Image();
        this.planes[r].img.onload = function() {
            self.planes[r].loaded = true;
        };
        this.planes[r].img.src = this.planes[r].src;
    }
};
