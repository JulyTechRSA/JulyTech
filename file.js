window.addEventListener('scroll', function() {
    var upperHeader = document.getElementById('upper-header');
    var lowerNav = document.getElementById('lower-nav');
    var scrollPosition = window.scrollY;

    if (scrollPosition > (window.innerHeight / 2)) {
        lowerNav.classList.add('fixed-nav');
    } else {
        lowerNav.classList.remove('fixed-nav');
    }
});