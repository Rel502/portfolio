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

/** Initializes all page features after the DOM is ready. */
function init() {
    setupActiveNavOnScroll();
    setupScrollButtons();
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

/**
 * Binds click handling to a group of active elements.
 * @param {string} selector - The CSS selector for the elements.
 */
function setupActiveElements(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        bindActiveElementClick(element, elements);
    });
}

/**
 * Binds the active state click handler to an element.
 * @param {Element} element - The clicked element.
 * @param {NodeListOf<Element>} elements - All related elements.
 */
function bindActiveElementClick(element, elements) {
    element.addEventListener('click', () => {
        activateElement(element, elements);
    });
}

/** Updates the active navigation link while scrolling. */
function setupActiveNavOnScroll() {
    const navLinks = document.querySelectorAll('.nav-list a[href^="#"]');
    const sections = document.querySelectorAll('main section[id]');

    if (navLinks.length === 0 || sections.length === 0) return;

    updateActiveNavLink(navLinks, sections);

    window.addEventListener('scroll', () => {
        updateActiveNavLink(navLinks, sections);
    });
}

/**
 * Sets the active navigation link for the current section.
 * @param {NodeListOf<HTMLAnchorElement>} navLinks - The navigation links.
 * @param {NodeListOf<HTMLElement>} sections - The page sections.
 */
function updateActiveNavLink(navLinks, sections) {
    const currentSectionId = getCurrentSectionId(sections);

    navLinks.forEach((link) => {
        const linkTargetId = link.getAttribute('href').replace('#', '');
        link.classList.toggle('active', linkTargetId === currentSectionId);
    });
}

/**
 * Returns the id of the currently visible section.
 * @param {NodeListOf<HTMLElement>} sections - The page sections.
 * @returns {string} The current section id.
 */
function getCurrentSectionId(sections) {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;
    let currentSectionId = '';

    sections.forEach((section) => {
        if (scrollPosition >= section.offsetTop) {
            currentSectionId = section.id;
        }
    });

    return currentSectionId;
}

/** Initializes the animated about location text. */
function setupAboutLocationAnimation() {
    const aboutElements = getAboutLocationElements();

    if (!aboutElements) return;

    prepareAboutLocation(aboutElements);
    observeAboutSection(aboutElements);
}

/**
 * Returns the elements used for the about location animation.
 * @returns {{section: HTMLElement, icon: HTMLImageElement, text: HTMLElement}|null} The about elements.
 */
function getAboutLocationElements() {
    const section = document.getElementById('about');
    const icon = document.getElementById('aboutLocationIcon');
    const text = document.getElementById('aboutLocationText');

    if (!section || !icon || !text) return null;

    return { section, icon, text };
}

/**
 * Sets the initial about location icon and text.
 * @param {Object} aboutElements - The about location elements.
 */
function prepareAboutLocation(aboutElements) {
    aboutElements.icon.src = ABOUT_LOCATION_ITEMS[0].icon;
    aboutElements.text.textContent = '';
}

/**
 * Starts observing the about section.
 * @param {Object} aboutElements - The about location elements.
 */
function observeAboutSection(aboutElements) {
    const observer = new IntersectionObserver((entries) => {
        startAnimationWhenVisible(entries, observer, aboutElements);
    }, {
        threshold: ABOUT_OBSERVER_THRESHOLD
    });

    observer.observe(aboutElements.section);
}

/**
 * Starts the about animation once the section is visible.
 * @param {IntersectionObserverEntry[]} entries - The observer entries.
 * @param {IntersectionObserver} observer - The section observer.
 * @param {Object} aboutElements - The about location elements.
 */
function startAnimationWhenVisible(entries, observer, aboutElements) {
    if (!entries[0].isIntersecting) return;

    startAboutLocationLoop(aboutElements.icon, aboutElements.text);
    observer.disconnect();
}

/**
 * Runs the about location text and icon loop.
 * @param {HTMLImageElement} iconElement - The location icon.
 * @param {HTMLElement} textElement - The location text element.
 * @returns {Promise<void>}
 */
async function startAboutLocationLoop(iconElement, textElement) {
    let currentIndex = 0;

    while (true) {
        await animateAboutLocationText(textElement, currentIndex);
        currentIndex = getNextLocationIndex(currentIndex);
        await switchLocationIcon(iconElement, currentIndex);
    }
}

/**
 * Types and deletes the current about location text.
 * @param {HTMLElement} textElement - The text element.
 * @param {number} currentIndex - The current location index.
 * @returns {Promise<void>}
 */
async function animateAboutLocationText(textElement, currentIndex) {
    const currentItem = ABOUT_LOCATION_ITEMS[currentIndex];
    const currentText = getCurrentTranslation(currentItem.textKey, currentItem.fallbackText);

    await typeText(textElement, currentText);
    await wait(TEXT_VISIBLE_DURATION);
    await deleteText(textElement);
}

/**
 * Returns the next about location index.
 * @param {number} currentIndex - The current location index.
 * @returns {number} The next location index.
 */
function getNextLocationIndex(currentIndex) {
    return (currentIndex + 1) % ABOUT_LOCATION_ITEMS.length;
}

/**
 * Switches the about location icon with a fade effect.
 * @param {HTMLImageElement} iconElement - The location icon.
 * @param {number} currentIndex - The current location index.
 * @returns {Promise<void>}
 */
async function switchLocationIcon(iconElement, currentIndex) {
    iconElement.classList.add('is-hidden');
    await wait(ICON_FADE_DURATION);

    iconElement.src = ABOUT_LOCATION_ITEMS[currentIndex].icon;
    iconElement.classList.remove('is-hidden');
}

/**
 * Types text into an element character by character.
 * @param {HTMLElement} element - The target element.
 * @param {string} text - The text to type.
 * @returns {Promise<void>}
 */
async function typeText(element, text) {
    element.textContent = '';

    for (const character of text) {
        element.textContent += character;
        await wait(TYPE_SPEED);
    }
}

/**
 * Deletes text from an element character by character.
 * @param {HTMLElement} element - The target element.
 * @returns {Promise<void>}
 */
async function deleteText(element) {
    while (element.textContent.length > 0) {
        element.textContent = element.textContent.slice(0, -1);
        await wait(DELETE_SPEED);
    }
}

/** Initializes the project tab switching. */
function setupProjectTabs() {
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectPanels = document.querySelectorAll('.project-panel');

    if (projectTabs.length === 0 || projectPanels.length === 0) return;

    projectTabs.forEach((tab) => {
        bindProjectTabClick(tab, projectTabs, projectPanels);
    });
}

/**
 * Binds the click handler for a project tab.
 * @param {HTMLElement} tab - The project tab.
 * @param {NodeListOf<HTMLElement>} projectTabs - All project tabs.
 * @param {NodeListOf<HTMLElement>} projectPanels - All project panels.
 */
function bindProjectTabClick(tab, projectTabs, projectPanels) {
    tab.addEventListener('click', () => {
        const selectedProject = tab.dataset.project;

        activateProjectTab(tab, projectTabs);
        showProjectPanel(selectedProject, projectPanels);
    });
}

/**
 * Activates the selected project tab.
 * @param {HTMLElement} activeTab - The selected project tab.
 * @param {NodeListOf<HTMLElement>} projectTabs - All project tabs.
 */
function activateProjectTab(activeTab, projectTabs) {
    resetActive(projectTabs);
    setActive(activeTab);
}

/**
 * Shows the matching project panel.
 * @param {string} selectedProject - The selected project key.
 * @param {NodeListOf<HTMLElement>} projectPanels - All project panels.
 */
function showProjectPanel(selectedProject, projectPanels) {
    projectPanels.forEach((panel) => {
        const isSelectedPanel = panel.dataset.project === selectedProject;

        panel.classList.toggle('active', isSelectedPanel);
    });
}

/**
 * Activates one element and resets the others.
 * @param {Element} activeElement - The element to activate.
 * @param {NodeListOf<Element>} elements - All related elements.
 */
function activateElement(activeElement, elements) {
    resetActive(elements);
    setActive(activeElement);
}

/**
 * Removes the active class from all elements.
 * @param {NodeListOf<Element>} elements - The elements to reset.
 */
function resetActive(elements) {
    elements.forEach((element) => {
        element.classList.remove('active');
    });
}

/**
 * Adds the active class to an element.
 * @param {Element} element - The element to activate.
 */
function setActive(element) {
    element.classList.add('active');
}

/**
 * Waits for a given duration.
 * @param {number} duration - The duration in milliseconds.
 * @returns {Promise<void>}
 */
function wait(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}