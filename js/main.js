const ABOUT_LOCATION_ITEMS = [
    {
        icon: './assets/icons/location-web.svg',
        textKey: 'about.locationWeb',
        fallbackText: 'I am based in Frankfurt.'
    },
    {
        icon: './assets/icons/location-remote.svg',
        textKey: 'about.locationRemote',
        fallbackText: 'I am open to remote work.'
    }
];

const ABOUT_OBSERVER_THRESHOLD = 0.4;
const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const TEXT_VISIBLE_DURATION = 1200;
const ICON_FADE_DURATION = 300;

document.addEventListener('DOMContentLoaded', init);

function init() {
    setupActiveElements('.nav-list a');
    setupScrollDownButton();
    setupAboutLocationAnimation();
    setupProjectTabs();

    if (typeof setupMobileMenu === 'function') {
        setupMobileMenu();
    }

    if (typeof setupLanguageSwitch === 'function') {
        setupLanguageSwitch();
    }

    if (typeof setupContactForm === 'function') {
        setupContactForm();
    }
}

function setupActiveElements(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        bindActiveElementClick(element, elements);
    });
}

function bindActiveElementClick(element, elements) {
    element.addEventListener('click', () => {
        activateElement(element, elements);
    });
}

function setupScrollDownButton() {
    const scrollElements = getScrollDownElements();

    if (!scrollElements) return;

    scrollElements.scrollDownButton.addEventListener('click', () => {
        activateElement(scrollElements.aboutNavLink, scrollElements.navLinks);
    });
}

function getScrollDownElements() {
    const scrollDownButton = document.querySelector('.scroll-down');
    const aboutNavLink = document.querySelector('.nav-list a[href="#about"]');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (!scrollDownButton || !aboutNavLink) return null;

    return { scrollDownButton, aboutNavLink, navLinks };
}

function setupAboutLocationAnimation() {
    const aboutElements = getAboutLocationElements();

    if (!aboutElements) return;

    prepareAboutLocation(aboutElements);
    observeAboutSection(aboutElements);
}

function getAboutLocationElements() {
    const section = document.getElementById('about');
    const icon = document.getElementById('aboutLocationIcon');
    const text = document.getElementById('aboutLocationText');

    if (!section || !icon || !text) return null;

    return { section, icon, text };
}

function prepareAboutLocation(aboutElements) {
    aboutElements.icon.src = ABOUT_LOCATION_ITEMS[0].icon;
    aboutElements.text.textContent = '';
}

function observeAboutSection(aboutElements) {
    const observer = new IntersectionObserver((entries) => {
        startAnimationWhenVisible(entries, observer, aboutElements);
    }, {
        threshold: ABOUT_OBSERVER_THRESHOLD
    });

    observer.observe(aboutElements.section);
}

function startAnimationWhenVisible(entries, observer, aboutElements) {
    if (!entries[0].isIntersecting) return;

    startAboutLocationLoop(aboutElements.icon, aboutElements.text);
    observer.disconnect();
}

async function startAboutLocationLoop(iconElement, textElement) {
    let currentIndex = 0;

    while (true) {
        await animateAboutLocationText(textElement, currentIndex);
        currentIndex = getNextLocationIndex(currentIndex);
        await switchLocationIcon(iconElement, currentIndex);
    }
}

async function animateAboutLocationText(textElement, currentIndex) {
    const currentItem = ABOUT_LOCATION_ITEMS[currentIndex];
    const currentText = getCurrentTranslation(currentItem.textKey, currentItem.fallbackText);

    await typeText(textElement, currentText);
    await wait(TEXT_VISIBLE_DURATION);
    await deleteText(textElement);
}

function getNextLocationIndex(currentIndex) {
    return (currentIndex + 1) % ABOUT_LOCATION_ITEMS.length;
}

async function switchLocationIcon(iconElement, currentIndex) {
    iconElement.classList.add('is-hidden');
    await wait(ICON_FADE_DURATION);

    iconElement.src = ABOUT_LOCATION_ITEMS[currentIndex].icon;
    iconElement.classList.remove('is-hidden');
}

async function typeText(element, text) {
    element.textContent = '';

    for (const character of text) {
        element.textContent += character;
        await wait(TYPE_SPEED);
    }
}

async function deleteText(element) {
    while (element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        await wait(DELETE_SPEED);
    }
}

function setupProjectTabs() {
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectPanels = document.querySelectorAll('.project-panel');

    if (projectTabs.length === 0 || projectPanels.length === 0) return;

    projectTabs.forEach((tab) => {
        bindProjectTabClick(tab, projectTabs, projectPanels);
    });
}

function bindProjectTabClick(tab, projectTabs, projectPanels) {
    tab.addEventListener('click', () => {
        const selectedProject = tab.dataset.project;

        activateProjectTab(tab, projectTabs);
        showProjectPanel(selectedProject, projectPanels);
    });
}

function activateProjectTab(activeTab, projectTabs) {
    resetActive(projectTabs);
    setActive(activeTab);
}

function showProjectPanel(selectedProject, projectPanels) {
    projectPanels.forEach((panel) => {
        const isSelectedPanel = panel.dataset.project === selectedProject;

        panel.classList.toggle('active', isSelectedPanel);
    });
}

function activateElement(activeElement, elements) {
    resetActive(elements);
    setActive(activeElement);
}

function resetActive(elements) {
    elements.forEach((element) => {
        element.classList.remove('active');
    });
}

function setActive(element) {
    element.classList.add('active');
}

function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}