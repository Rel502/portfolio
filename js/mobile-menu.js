// Mobile menu logic

const HERO_ELLIPSE_SCALE = 1.15;
const HERO_ELLIPSE_CENTER_Y = 0.54;

const BURGER_ICONS = [
    './assets/icons/burger-menu-default.svg',
    './assets/icons/burger-menu-01.svg',
    './assets/icons/burger-menu-02.svg',
    './assets/icons/burger-menu-close.svg'
];

const BURGER_ANIMATION_SPEED = 80;
let burgerAnimationTimeouts = [];

/** Initializes the mobile menu and binds its events. */
function setupMobileMenu() {
    const mobileMenu = getMobileMenuElements();

    if (!mobileMenu) return;

    preloadBurgerIcons();
    bindBurgerButton(mobileMenu);
    bindMobileMenuLinks(mobileMenu);
}

/** Preloads all burger menu icons. */
function preloadBurgerIcons() {
    BURGER_ICONS.forEach((iconPath) => {
        const image = new Image();
        image.src = iconPath;
    });
}

/**
 * Binds the burger button click handler.
 * @param {Object} mobileMenu - The mobile menu elements.
 */
function bindBurgerButton(mobileMenu) {
    mobileMenu.burgerButton.addEventListener('click', () => {
        toggleMobileMenu(mobileMenu);
    });
}

/**
 * Closes the mobile menu when a menu link is clicked.
 * @param {Object} mobileMenu - The mobile menu elements.
 */
function bindMobileMenuLinks(mobileMenu) {
    const menuLinks = mobileMenu.mobileHeroMenu.querySelectorAll('a');

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => closeMobileMenu(mobileMenu));
    });
}

/**
 * Closes the mobile menu and resets the burger icon.
 * @param {Object} mobileMenu - The mobile menu elements.
 */
function closeMobileMenu(mobileMenu) {
    setMobileMenuState(mobileMenu, false);
    animateBurgerIcon(mobileMenu.burgerButton, false);
}

/**
 * Returns the required mobile menu elements.
 * @returns {Object|null} The mobile menu elements or null.
 */
function getMobileMenuElements() {
    const burgerButton = document.querySelector('.burger-btn');
    const mobileHeroMenu = document.getElementById('mobileHeroMenu');

    if (!burgerButton || !mobileHeroMenu) return null;

    return { burgerButton, mobileHeroMenu };
}

/**
 * Updates the open state of the mobile menu.
 * @param {Object} mobileMenu - The mobile menu elements.
 * @param {boolean} isOpen - Whether the menu should be open.
 */
function setMobileMenuState(mobileMenu, isOpen) {
    mobileMenu.mobileHeroMenu.classList.toggle('is-open', isOpen);
    mobileMenu.burgerButton.classList.toggle('is-open', isOpen);
    mobileMenu.burgerButton.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
}

/**
 * Updates the mobile menu position based on the hero image.
 * @param {Object} mobileMenu - The mobile menu elements.
 */
function updateMobileMenuPosition(mobileMenu) {
    if (!mobileMenu.heroImageWrapper) return;

    const ellipseRect = getHeroEllipseRect(mobileMenu.heroImageWrapper);

    applyMobileMenuRect(mobileMenu.navbarMenu, ellipseRect);
}

/**
 * Calculates the ellipse rectangle around the hero image.
 * @param {Element} anchor - The hero image wrapper.
 * @returns {Object} The calculated ellipse rectangle.
 */
function getHeroEllipseRect(anchor) {
    const rect = anchor.getBoundingClientRect();
    const width = rect.width * HERO_ELLIPSE_SCALE;
    const height = rect.height * HERO_ELLIPSE_SCALE;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * HERO_ELLIPSE_CENTER_Y;

    return {
        top: centerY - height / 2,
        left: centerX - width / 2,
        width,
        height
    };
}

/**
 * Applies the calculated menu rectangle as CSS variables.
 * @param {HTMLElement} navbarMenu - The menu element.
 * @param {Object} rect - The calculated rectangle.
 */
function applyMobileMenuRect(navbarMenu, rect) {
    navbarMenu.style.setProperty('--mobile-menu-top', `${rect.top}px`);
    navbarMenu.style.setProperty('--mobile-menu-left', `${rect.left}px`);
    navbarMenu.style.setProperty('--mobile-menu-width', `${rect.width}px`);
    navbarMenu.style.setProperty('--mobile-menu-height', `${rect.height}px`);
}

/**
 * Toggles the mobile menu open state.
 * @param {Object} mobileMenu - The mobile menu elements.
 */
function toggleMobileMenu(mobileMenu) {
    const isOpen = !mobileMenu.mobileHeroMenu.classList.contains('is-open');

    setMobileMenuState(mobileMenu, isOpen);
    animateBurgerIcon(mobileMenu.burgerButton, isOpen);
}

/**
 * Starts the burger icon animation.
 * @param {HTMLButtonElement} burgerButton - The burger button.
 * @param {boolean} isOpen - Whether the menu is opening.
 */
function animateBurgerIcon(burgerButton, isOpen) {
    const burgerIcon = burgerButton.querySelector('.burger-icon');

    if (!burgerIcon) return;

    clearBurgerAnimationTimeouts();
    playBurgerIconSequence(burgerIcon, isOpen);
}

/**
 * Plays the burger icon frame sequence.
 * @param {HTMLImageElement} burgerIcon - The burger icon image.
 * @param {boolean} isOpen - Whether the menu is opening.
 */
function playBurgerIconSequence(burgerIcon, isOpen) {
    const iconSequence = getBurgerIconSequence(isOpen);

    iconSequence.forEach((iconPath, index) => {
        scheduleBurgerIconChange(burgerIcon, iconPath, index);
    });
}

/**
 * Returns the burger icon sequence for opening or closing.
 * @param {boolean} isOpen - Whether the menu is opening.
 * @returns {string[]} The icon path sequence.
 */
function getBurgerIconSequence(isOpen) {
    if (isOpen) return BURGER_ICONS;

    return [...BURGER_ICONS].reverse();
}

/**
 * Schedules a burger icon frame change.
 * @param {HTMLImageElement} burgerIcon - The burger icon image.
 * @param {string} iconPath - The icon path.
 * @param {number} index - The frame index.
 */
function scheduleBurgerIconChange(burgerIcon, iconPath, index) {
    const timeout = setTimeout(() => {
        burgerIcon.src = iconPath;
    }, index * BURGER_ANIMATION_SPEED);

    burgerAnimationTimeouts.push(timeout);
}

/** Clears all pending burger icon animation timeouts. */
function clearBurgerAnimationTimeouts() {
    burgerAnimationTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
    });

    burgerAnimationTimeouts = [];
}