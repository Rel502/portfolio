document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('initializing');
    setupActiveElements('.nav-list a');
    setupActiveElements('.language-btn');
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

function resetActive(elements) {
    elements.forEach((element) => {
        element.classList.remove('active');
    });
}

function setActive(element) {
    element.classList.add('active');
}