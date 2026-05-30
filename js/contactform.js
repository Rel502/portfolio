function setupContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    const contactElements = getContactFormElements(contactForm);

    bindContactSubmit(contactForm, contactElements);
    bindContactFields(contactForm, contactElements);
    bindPrivacyCheckbox(contactForm, contactElements);
    bindDeferredContactStateUpdates(contactForm, contactElements);
    updateContactFormState(contactForm, contactElements.submitButton);
}

function getContactFormElements(contactForm) {
    return {
        formFields: getContactFormFields(contactForm),
        submitButton: contactForm.querySelector('.contact-submit-btn'),
        privacyCheckbox: contactForm.querySelector('.privacy-check input')
    };
}

function bindContactSubmit(contactForm, contactElements) {
    contactForm.addEventListener('submit', (event) => {
        validateContactForm(event, contactElements.submitButton);
    });
}

function bindContactFields(contactForm, contactElements) {
    contactElements.formFields.forEach((field) => {
        bindContactFieldEvents(field, contactForm, contactElements.submitButton);
    });
}

function bindContactFieldEvents(field, contactForm, submitButton) {
    field.addEventListener('input', () => {
        handleContactFieldChange(field, contactForm, submitButton);
    });

    field.addEventListener('change', () => {
        handleContactFieldChange(field, contactForm, submitButton);
    });
}

function bindPrivacyCheckbox(contactForm, contactElements) {
    if (!contactElements.privacyCheckbox) return;

    contactElements.privacyCheckbox.addEventListener('change', () => {
        updateContactFormState(contactForm, contactElements.submitButton);
    });
}

function bindDeferredContactStateUpdates(contactForm, contactElements) {
    contactForm.addEventListener('focusin', () => {
        scheduleContactFormStateUpdate(contactForm, contactElements.submitButton);
    });

    contactForm.addEventListener('click', () => {
        scheduleContactFormStateUpdate(contactForm, contactElements.submitButton);
    });
}

function scheduleContactFormStateUpdate(contactForm, submitButton) {
    setTimeout(() => {
        updateContactFormState(contactForm, submitButton);
    }, 200);
}

function handleContactFieldChange(field, contactForm, submitButton) {
    validateContactField(field);
    updateContactFormState(contactForm, submitButton);
}

function updateContactFormState(contactForm, submitButton) {
    updateContactSubmitButton(contactForm, submitButton);
    updatePrivacyCheckState(contactForm);
}

function updateContactSubmitButton(contactForm, submitButton) {
    if (!submitButton) return;

    submitButton.disabled = !contactForm.checkValidity();
}

function updatePrivacyCheckState(contactForm) {
    const privacyCheck = getPrivacyCheck(contactForm);

    if (!privacyCheck) return;

    const shouldShowError = shouldShowPrivacyError(contactForm, privacyCheck.checkbox);

    privacyCheck.label.classList.toggle('privacy-check--error', shouldShowError);
}

function getPrivacyCheck(contactForm) {
    const label = contactForm.querySelector('.privacy-check');
    const checkbox = contactForm.querySelector('.privacy-check input');

    if (!label || !checkbox) return null;

    return { label, checkbox };
}

function shouldShowPrivacyError(contactForm, privacyCheckbox) {
    return areContactFieldsValid(contactForm) && !privacyCheckbox.checked;
}

function areContactFieldsValid(contactForm) {
    const formFields = getContactFormFields(contactForm);

    return Array.from(formFields).every(isContactFieldValid);
}

function getContactFormFields(contactForm) {
    return contactForm.querySelectorAll('.form-group input, .form-group textarea');
}

function validateContactForm(event, submitButton) {
    event.preventDefault();

    const contactForm = event.currentTarget;

    validateContactFormFields(contactForm);
    updateContactFormState(contactForm, submitButton);

    if (!contactForm.checkValidity()) return;

    showContactSuccessMessage(contactForm);
    resetContactForm(contactForm, submitButton);
}

function validateContactFormFields(contactForm) {
    const formFields = getContactFormFields(contactForm);

    formFields.forEach((field) => {
        validateContactField(field);
    });
}

function showContactSuccessMessage(contactForm) {
    const successMessage = contactForm.querySelector('#contactSuccessMessage');

    if (!successMessage) return;

    successMessage.classList.add('is-visible');

    setTimeout(() => {
        hideContactSuccessMessage(successMessage);
    }, 3000);
}

function hideContactSuccessMessage(successMessage) {
    successMessage.classList.remove('is-visible');
}

function resetContactForm(contactForm, submitButton) {
    contactForm.reset();

    resetContactFieldStates(contactForm);
    resetPrivacyCheckState(contactForm);
    updateContactSubmitButton(contactForm, submitButton);
}

function resetContactFieldStates(contactForm) {
    const formGroups = contactForm.querySelectorAll('.form-group');

    formGroups.forEach((formGroup) => {
        formGroup.classList.remove('form-group--error');
    });
}

function resetPrivacyCheckState(contactForm) {
    const privacyCheck = contactForm.querySelector('.privacy-check');

    if (!privacyCheck) return;

    privacyCheck.classList.remove('privacy-check--error');
}

function validateContactField(field) {
    const formGroup = field.closest('.form-group');

    if (!formGroup) return;

    updateContactFieldErrorMessage(field, formGroup);
    formGroup.classList.toggle('form-group--error', !isContactFieldValid(field));
}

function updateContactFieldErrorMessage(field, formGroup) {
    const errorMessage = formGroup.querySelector('.form-error');

    if (!errorMessage) return;

    errorMessage.textContent = getContactFieldErrorMessage(field, errorMessage);
}

function getContactFieldErrorMessage(field, errorMessage) {
    if (isEmptyContactField(field)) {
        return errorMessage.dataset.requiredMessage || errorMessage.textContent;
    }

    if (isInvalidEmailField(field)) {
        return errorMessage.dataset.invalidMessage;
    }

    return errorMessage.textContent;
}

function isContactFieldValid(field) {
    const fieldValue = field.value.trim();

    if (fieldValue === '') return false;

    if (field.type === 'email') {
        return isValidEmail(fieldValue);
    }

    return true;
}

function isEmptyContactField(field) {
    return field.value.trim() === '';
}

function isInvalidEmailField(field) {
    return field.type === 'email' && !isValidEmail(field.value.trim());
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
}