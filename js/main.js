document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('initializing');
    setupActiveElements('.nav-list a');
    setupActiveElements('.language-btn');
    setupScrollDownButton();
}

function setupActiveElements(selector) {
    let elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        element.addEventListener('click', () => {
            resetActive(elements);
            setActive(element);
        });
    });
}

function setupScrollDownButton() {
    let scrollDownButton = document.querySelector('.scroll-down');
    let aboutNavLink = document.querySelector('.nav-list a[href="#about"]');
    let navLinks = document.querySelectorAll('.nav-list a');

    if (!scrollDownButton || !aboutNavLink) {
        return;
    }

    scrollDownButton.addEventListener('click', () => {
        resetActive(navLinks);
        setActive(aboutNavLink);
    });
}

function resetActive(elements) {
    elements.forEach((element) => {
        element.classList.remove('active');
    });
}

function setActive(element) {
    element.classList.add('active');
}