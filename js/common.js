(function () {
    var nav = document.getElementById('nav-items'),
        link = nav.getElementsByTagName('li'),
        current = window.location.pathname.split('.html')[0];
    current = current.split('/')[1];
    if(current === ''){
        link[0].className = "active";
    }
    for (var i = 0; i < link.length; i++) {
        if (link[i].children[0].className == current) {
            link[i].className = "active";
        }
    }
})();