(function () {
    var nav = document.getElementById('nav-items'),
        link = nav.getElementsByTagName('li'),
        current = window.location.pathname.split('.html')[0];
        current = current.split('/')[1];
    for (var i = 0; i < link.length; i++) {
        if (link[i].children[0].className == current) {
            link[i].className = "active";
        }
    }
})();