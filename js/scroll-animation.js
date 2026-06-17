const SCROLL_OVERSHOOT_DISTANCE = 32;
const MOBILE_SCROLL_QUERY = '(max-width: 1024px)';

/**
 * Returns the scroll overshoot distance for the current layout.
 * @returns {number} The overshoot distance in pixels.
 */
function getScrollOvershootDistance() {
    const isMobileLayout = window.matchMedia(MOBILE_SCROLL_QUERY).matches;

    return isMobileLayout ? 0 : SCROLL_OVERSHOOT_DISTANCE;
}

/** Sets the initial scroll position when no hash is present. */
function setInitialScrollPosition() {
    if (window.location.hash) return;

    window.scrollTo(0, getScrollOvershootDistance());
}

/** Initializes all internal anchor scroll buttons. */
function setupScrollButtons() {
    setInitialScrollPosition();

    const scrollButtons = getScrollButtons();

    scrollButtons.forEach((button) => {
        button.addEventListener('click', (event) => handleScrollButtonClick(event, button));
    });
}

/**
 * Returns all internal anchor links.
 * @returns {NodeListOf<HTMLAnchorElement>} The scroll buttons.
 */
function getScrollButtons() {
    return document.querySelectorAll('a[href^="#"]');
}

/**
 * Handles a scroll button click.
 * @param {MouseEvent} event - The click event.
 * @param {HTMLAnchorElement} button - The clicked anchor element.
 */
function handleScrollButtonClick(event, button) {
    event.preventDefault();

    const targetId = getScrollTargetId(button);

    if (!targetId) return;

    scrollToSection(targetId);
}

/**
 * Returns the target section id from an anchor element.
 * @param {HTMLAnchorElement} button - The anchor element.
 * @returns {string|undefined} The target section id.
 */
function getScrollTargetId(button) {
    return button.getAttribute('href')?.replace('#', '');
}

/**
 * Scrolls smoothly to a section by id.
 * @param {string} sectionId - The target section id.
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    const targetPosition = getSectionPosition(section);
    const scrollTarget = getOvershootScrollTarget(targetPosition);

    animateScrollTo(scrollTarget.overshootPosition, 700, () => {
        animateScrollTo(scrollTarget.finalPosition, 300);
    });
}

/**
 * Calculates the overshoot and final scroll positions.
 * @param {number} targetPosition - The target section position.
 * @returns {{overshootPosition: number, finalPosition: number}} The scroll target positions.
 */
function getOvershootScrollTarget(targetPosition) {
    const isScrollingUp = targetPosition < window.scrollY;
    const overshootDistance = getScrollOvershootDistance();

    if (isScrollingUp) {
        return {
            overshootPosition: targetPosition,
            finalPosition: targetPosition + overshootDistance
        };
    }

    return {
        overshootPosition: targetPosition + overshootDistance,
        finalPosition: targetPosition
    };
}

/**
 * Animates the window scroll position.
 * @param {number} targetPosition - The target scroll position.
 * @param {number} [duration=700] - The animation duration in milliseconds.
 * @param {Function} [onComplete] - Callback after the animation finishes.
 */
function animateScrollTo(targetPosition, duration = 700, onComplete) {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    requestAnimationFrame(function scroll(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo({
            top: startPosition + distance * easedProgress,
            behavior: 'auto'
        });

        if (progress < 1) {
            requestAnimationFrame(scroll);
            return;
        }

        if (onComplete) onComplete();
    });
}

/**
 * Applies an ease-in-out cubic curve.
 * @param {number} progress - The animation progress from 0 to 1.
 * @returns {number} The eased progress value.
 */
function easeInOutCubic(progress) {
    return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

/**
 * Returns the scroll position of a section including scroll margin.
 * @param {HTMLElement} section - The target section element.
 * @returns {number} The section scroll position.
 */
function getSectionPosition(section) {
    const scrollMarginTop = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const sectionPosition = section.offsetTop - scrollMarginTop;

    return Math.max(sectionPosition, 0);
}