document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('initializing');
    updateActiveNavLinks();
}

function updateActiveNavLinks() {
    let navLinks = document.querySelectorAll('.nav-list a');

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            resetActive(navLinks);
            setActive(link);
        });
    });
}

function resetActive(links) {
    links.forEach((link) => {
        link.classList.remove('active');
    });
}

function setActive(link) {
    link.classList.add('active');
}