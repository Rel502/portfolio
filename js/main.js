document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('initializing');
    setupActiveElements('.nav-list a');
    setupActiveElements('.language-btn');
    setupScrollDownButton();
    setupAboutLocationAnimation();
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

function setupAboutLocationAnimation() {
    let locationItems = [
        {
            icon: './assets/icons/location-web.svg',
            text: 'I am based in Frankfurt.'
        },
        {
            icon: './assets/icons/location-remote.svg',
            text: 'I am open to remote work.'
        }
    ];

    let aboutSection = document.getElementById('about');
    let iconElement = document.getElementById('aboutLocationIcon');
    let textElement = document.getElementById('aboutLocationText');

    if (!aboutSection || !iconElement || !textElement) {
        return;
    }

    iconElement.src = locationItems[0].icon;
    textElement.textContent = '';

    let observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startAboutLocationLoop(iconElement, textElement, locationItems);
            observer.disconnect();
        }
    }, {
        threshold: 0.4
    });

    observer.observe(aboutSection);
}

function startAboutLocationLoop(iconElement, textElement, locationItems) {
    let currentIndex = 0;

    animateAboutLocationItem(iconElement, textElement, locationItems, currentIndex);
}

function animateAboutLocationItem(iconElement, textElement, locationItems, currentIndex) {
    let currentItem = locationItems[currentIndex];

    iconElement.src = currentItem.icon;

    typeText(textElement, currentItem.text, () => {
        setTimeout(() => {
            deleteText(textElement, () => {
                let nextIndex = (currentIndex + 1) % locationItems.length;

                iconElement.classList.add('is-hidden');

                setTimeout(() => {
                    iconElement.src = locationItems[nextIndex].icon;
                    iconElement.classList.remove('is-hidden');

                    animateAboutLocationItem(iconElement, textElement, locationItems, nextIndex);
                }, 300);
            });
        }, 1200);
    });
}

function typeText(element, text, callback) {
    let index = 0;
    element.textContent = '';

    let typingInterval = setInterval(() => {
        element.textContent += text[index];
        index++;

        if (index >= text.length) {
            clearInterval(typingInterval);

            if (callback) {
                callback();
            }
        }
    }, 70);
}

function deleteText(element, callback) {
    let deletingInterval = setInterval(() => {
        element.textContent = element.textContent.slice(0, -1);

        if (element.textContent.length === 0) {
            clearInterval(deletingInterval);

            if (callback) {
                callback();
            }
        }
    }, 40);
}

function resetActive(elements) {
    elements.forEach((element) => {
        element.classList.remove('active');
    });
}

function setActive(element) {
    element.classList.add('active');
}