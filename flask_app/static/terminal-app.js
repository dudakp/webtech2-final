const setActiveNavLink = () => {
    // remove active class and current tag
    $('.nav-link').removeClass('active');
    $('.nav-link:first').html('Simulacie');
    $('.nav-link:last').html('Octave terminal');

    let activeLink;
    const srCurrent = '<span class="sr-only">(current)</span>';
    if (window.location.pathname === '/terminal') {
        activeLink = $('.nav-link:last');
    } else {
        activeLink = $('.nav-link:first');
    }
    activeLink.append(srCurrent);
    activeLink.addClass('active');
};

$(document).ready(() => {
    setActiveNavLink();
});

