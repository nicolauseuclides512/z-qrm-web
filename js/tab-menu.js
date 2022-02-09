function openWidget(evt, widgetName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(widgetName).style.display = "block";
    evt.currentTarget.className += " active";
}

var initialScreenSize = window.innerHeight;
window.addEventListener("resize", function () {
    if (window.innerHeight < initialScreenSize) {
        $("#bottombar").hide();
    } else {
        $("#bottombar").show();
    }
});