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

function setupMobileMenu() {
    const mobileMenu = getMobileMenuElements();

    if (!mobileMenu) return;

    bindBurgerButton(mobileMenu);
    bindMobileMenuLinks(mobileMenu);
}

function bindBurgerButton(mobileMenu) {
    mobileMenu.burgerButton.addEventListener('click', () => {
        toggleMobileMenu(mobileMenu);
    });
}

function bindMobileMenuLinks(mobileMenu) {
    const menuLinks = mobileMenu.mobileHeroMenu.querySelectorAll('a');

    menuLinks.forEach((link) => {
        link.addEventListener('click', () => closeMobileMenu(mobileMenu));
    });
}

function closeMobileMenu(mobileMenu) {
    setMobileMenuState(mobileMenu, false);
    animateBurgerIcon(mobileMenu.burgerButton, false);
}

function getMobileMenuElements() {
    const burgerButton = document.querySelector('.burger-btn');
    const mobileHeroMenu = document.getElementById('mobileHeroMenu');

    if (!burgerButton || !mobileHeroMenu) return null;

    return { burgerButton, mobileHeroMenu };
}

function setMobileMenuState(mobileMenu, isOpen) {
    mobileMenu.mobileHeroMenu.classList.toggle('is-open', isOpen);
    mobileMenu.burgerButton.classList.toggle('is-open', isOpen);
    mobileMenu.burgerButton.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('mobile-menu-open', isOpen);
}

function updateMobileMenuPosition(mobileMenu) {
    if (!mobileMenu.heroImageWrapper) return;

    const ellipseRect = getHeroEllipseRect(mobileMenu.heroImageWrapper);

    applyMobileMenuRect(mobileMenu.navbarMenu, ellipseRect);
}

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

function applyMobileMenuRect(navbarMenu, rect) {
    navbarMenu.style.setProperty('--mobile-menu-top', `${rect.top}px`);
    navbarMenu.style.setProperty('--mobile-menu-left', `${rect.left}px`);
    navbarMenu.style.setProperty('--mobile-menu-width', `${rect.width}px`);
    navbarMenu.style.setProperty('--mobile-menu-height', `${rect.height}px`);
}

function toggleMobileMenu(mobileMenu) {
    const isOpen = !mobileMenu.mobileHeroMenu.classList.contains('is-open');

    setMobileMenuState(mobileMenu, isOpen);
    animateBurgerIcon(mobileMenu.burgerButton, isOpen);
}

function animateBurgerIcon(burgerButton, isOpen) {
    const burgerIcon = burgerButton.querySelector('.burger-icon');

    if (!burgerIcon) return;

    clearBurgerAnimationTimeouts();
    playBurgerIconSequence(burgerIcon, isOpen);
}

function playBurgerIconSequence(burgerIcon, isOpen) {
    const iconSequence = getBurgerIconSequence(isOpen);

    iconSequence.forEach((iconPath, index) => {
        scheduleBurgerIconChange(burgerIcon, iconPath, index);
    });
}

function getBurgerIconSequence(isOpen) {
    if (isOpen) return BURGER_ICONS;

    return [...BURGER_ICONS].reverse();
}

function scheduleBurgerIconChange(burgerIcon, iconPath, index) {
    const timeout = setTimeout(() => {
        burgerIcon.src = iconPath;
    }, index * BURGER_ANIMATION_SPEED);

    burgerAnimationTimeouts.push(timeout);
}

function clearBurgerAnimationTimeouts() {
    burgerAnimationTimeouts.forEach((timeout) => {
        clearTimeout(timeout);
    });

    burgerAnimationTimeouts = [];
}