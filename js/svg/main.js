
$(document).ready(function() {

    var w = $("#sky").width();
    var h = $("#sky").height();

    window.Sky = new Raphael(document.getElementById("sky"), w, h);

    console.log(Raphael.angle(100,100,0,0));

    return;

    window.Airspace = new Airspace(window, window.Sky, w, h);

    $(".pause").click(function() {
        if($(this).text() == "PAUSE") {
            window.Airspace.pause();
            $(this).text("UNPAUSE");
        } else {
            window.Airspace.start();
            $(this).text("PAUSE");
        }
    });

    window.Airspace.addPlane(300, 10, 135, 100);
    window.Airspace.addPlane(200, 200, 0, 120);
    window.Airspace.addPlane(10, 10, 270, 80);
});