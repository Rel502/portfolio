const SCROLL_OVERSHOOT_DISTANCE = 32;
const MOBILE_SCROLL_QUERY = '(max-width: 1024px)';

function getScrollOvershootDistance() {
    const isMobileLayout = window.matchMedia(MOBILE_SCROLL_QUERY).matches;

    return isMobileLayout ? 0 : SCROLL_OVERSHOOT_DISTANCE;
}

function setInitialScrollPosition() {
    if (window.location.hash) return;

    window.scrollTo(0, getScrollOvershootDistance());
}

function setupScrollButtons() {
    setInitialScrollPosition();

    const scrollButtons = getScrollButtons();

    scrollButtons.forEach((button) => {
        button.addEventListener('click', (event) => handleScrollButtonClick(event, button));
    });
}

function getScrollButtons() {
    return document.querySelectorAll('a[href^="#"]');
}

function handleScrollButtonClick(event, button) {
    event.preventDefault();

    const targetId = getScrollTargetId(button);

    if (!targetId) return;

    scrollToSection(targetId);
}

function getScrollTargetId(button) {
    return button.getAttribute('href')?.replace('#', '');
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (!section) return;

    const targetPosition = getSectionPosition(section);
    const scrollTarget = getOvershootScrollTarget(targetPosition);

    animateScrollTo(scrollTarget.overshootPosition, 700, () => {
        animateScrollTo(scrollTarget.finalPosition, 300);
    });
}

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

function easeInOutCubic(progress) {
    return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function getSectionPosition(section) {
    const scrollMarginTop = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const sectionPosition = section.offsetTop - scrollMarginTop;

    return Math.max(sectionPosition, 0);
}