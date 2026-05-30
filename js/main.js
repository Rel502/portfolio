const ABOUT_LOCATION_ITEMS = [
    {
        icon: './assets/icons/location-web.svg',
        text: 'I am based in Frankfurt.'
    },
    {
        icon: './assets/icons/location-remote.svg',
        text: 'I am open to remote work.'
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
    setupActiveElements('.language-btn');
    setupScrollDownButton();
    setupAboutLocationAnimation();
    setupProjectTabs();
    setupContactForm();
}

function setupActiveElements(selector) {
    const elements = document.querySelectorAll(selector);

    elements.forEach((element) => {
        element.addEventListener('click', () => {
            activateElement(element, elements);
        });
    });
}

function setupScrollDownButton() {
    const scrollDownButton = document.querySelector('.scroll-down');
    const aboutNavLink = document.querySelector('.nav-list a[href="#about"]');
    const navLinks = document.querySelectorAll('.nav-list a');

    if (!scrollDownButton || !aboutNavLink) return;

    scrollDownButton.addEventListener('click', () => {
        activateElement(aboutNavLink, navLinks);
    });
}

function setupAboutLocationAnimation() {
    const aboutElements = getAboutLocationElements();

    if (!aboutElements) return;

    prepareAboutLocation(aboutElements);
    observeAboutSection(aboutElements);
}

function setupProjectTabs() {
    const projectTabs = document.querySelectorAll('.project-tab');
    const projectPanels = document.querySelectorAll('.project-panel');

    if (projectTabs.length === 0 || projectPanels.length === 0) return;

    projectTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const selectedProject = tab.dataset.project;

            activateProjectTab(tab, projectTabs);
            showProjectPanel(selectedProject, projectPanels);
        });
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    const formFields = contactForm.querySelectorAll('.form-group input, .form-group textarea');
    const allRequiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
    const submitButton = contactForm.querySelector('.contact-submit-btn');
    const privacyCheckbox = contactForm.querySelector('.privacy-check input');

    contactForm.addEventListener('submit', validateContactForm);

    formFields.forEach((field) => {
        field.addEventListener('input', () => {
            validateContactField(field);
            updateContactFormState(contactForm, submitButton);
        });

        field.addEventListener('change', () => {
            validateContactField(field);
            updateContactFormState(contactForm, submitButton);
        });
    });

    allRequiredFields.forEach((field) => {
        field.addEventListener('change', () => {
            updateContactFormState(contactForm, submitButton);
        });
    });

    if (privacyCheckbox) {
        privacyCheckbox.addEventListener('change', () => {
            updateContactFormState(contactForm, submitButton);
        });
    }

    contactForm.addEventListener('focusin', () => {
        setTimeout(() => {
            updateContactFormState(contactForm, submitButton);
        }, 200);
    });

    contactForm.addEventListener('click', () => {
        setTimeout(() => {
            updateContactFormState(contactForm, submitButton);
        }, 200);
    });
}

function updateContactFormState(contactForm, submitButton) {
    updateContactSubmitButton(contactForm, submitButton);
    updatePrivacyCheckState(contactForm);
}

function updatePrivacyCheckState(contactForm) {
    const privacyCheck = contactForm.querySelector('.privacy-check');
    const privacyCheckbox = contactForm.querySelector('.privacy-check input');
    const formFields = contactForm.querySelectorAll('.form-group input, .form-group textarea');

    if (!privacyCheck || !privacyCheckbox) return;

    const areContactFieldsValid = Array.from(formFields).every((field) => {
        return isContactFieldValid(field);
    });

    const shouldShowPrivacyError = areContactFieldsValid && !privacyCheckbox.checked;

    privacyCheck.classList.toggle('privacy-check--error', shouldShowPrivacyError);
}

function updateContactSubmitButton(contactForm, submitButton) {
    if (!submitButton) return;

    submitButton.disabled = !contactForm.checkValidity();
}

function validateContactForm(event) {
    event.preventDefault();

    const contactForm = event.currentTarget;
    const formFields = contactForm.querySelectorAll('.form-group input, .form-group textarea');
    const submitButton = contactForm.querySelector('.contact-submit-btn');

    formFields.forEach((field) => {
        validateContactField(field);
    });

    updateContactFormState(contactForm, submitButton);

    if (!contactForm.checkValidity()) return;

    showContactSuccessMessage(contactForm);
    resetContactForm(contactForm, submitButton);
}

function showContactSuccessMessage(contactForm) {
    const successMessage = contactForm.querySelector('#contactSuccessMessage');

    if (!successMessage) return;

    successMessage.classList.add('is-visible');

    setTimeout(() => {
        successMessage.classList.remove('is-visible');
    }, 3000);
}

function resetContactForm(contactForm, submitButton) {
    contactForm.reset();

    const formGroups = contactForm.querySelectorAll('.form-group');
    const privacyCheck = contactForm.querySelector('.privacy-check');

    formGroups.forEach((formGroup) => {
        formGroup.classList.remove('form-group--error');
    });

    if (privacyCheck) {
        privacyCheck.classList.remove('privacy-check--error');
    }

    updateContactSubmitButton(contactForm, submitButton);
}

function validateContactField(field) {
    const formGroup = field.closest('.form-group');
    const isFieldValid = isContactFieldValid(field);

    updateContactFieldErrorMessage(field, formGroup);

    formGroup.classList.toggle('form-group--error', !isFieldValid);
}

function updateContactFieldErrorMessage(field, formGroup) {
    const errorMessage = formGroup.querySelector('.form-error');

    if (!errorMessage) return;

    const fieldValue = field.value.trim();
    const isEmailField = field.type === 'email';

    if (fieldValue === '') {
        errorMessage.textContent = errorMessage.dataset.requiredMessage || errorMessage.textContent;
        return;
    }

    if (isEmailField && !isValidEmail(fieldValue)) {
        errorMessage.textContent = errorMessage.dataset.invalidMessage;
    }
}

function isContactFieldValid(field) {
    const fieldValue = field.value.trim();

    if (fieldValue === '') {
        return false;
    }

    if (field.type === 'email') {
        return isValidEmail(fieldValue);
    }

    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
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
    const currentText = ABOUT_LOCATION_ITEMS[currentIndex].text;

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