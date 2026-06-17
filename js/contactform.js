const CONTACT_FORM_ENDPOINT = 'https://michaelzeitler.de/send-mail.php';

/** Initializes the contact form and binds all required events. */
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

/**
 * Returns the main elements used by the contact form logic.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @returns {Object} The relevant form fields and controls.
 */
function getContactFormElements(contactForm) {
    return {
        formFields: getContactFormFields(contactForm),
        submitButton: contactForm.querySelector('.contact-submit-btn'),
        privacyCheckbox: contactForm.querySelector('.privacy-check input')
    };
}

/**
 * Binds the submit event to the contact form.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {Object} contactElements - The collected contact form elements.
 */
function bindContactSubmit(contactForm, contactElements) {
    contactForm.addEventListener('submit', (event) => {
        validateContactForm(event, contactElements.submitButton);
    });
}

/**
 * Binds validation events to all contact form fields.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {Object} contactElements - The collected contact form elements.
 */
function bindContactFields(contactForm, contactElements) {
    contactElements.formFields.forEach((field) => {
        bindContactFieldEvents(field, contactForm, contactElements.submitButton);
    });
}

/**
 * Binds blur validation and input state updates to a form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 */
function bindContactFieldEvents(field, contactForm, submitButton) {
    field.addEventListener('blur', () => {
        handleContactFieldBlur(field, contactForm, submitButton);
    });

    field.addEventListener('input', () => {
        updateContactSubmitButton(contactForm, submitButton);
    });
}

/**
 * Binds change handling to the privacy checkbox.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {Object} contactElements - The collected contact form elements.
 */
function bindPrivacyCheckbox(contactForm, contactElements) {
    if (!contactElements.privacyCheckbox) return;

    contactElements.privacyCheckbox.addEventListener('change', () => {
        updateContactFormState(contactForm, contactElements.submitButton);
    });
}

/**
 * Schedules delayed state updates for focus and click interactions.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {Object} contactElements - The collected contact form elements.
 */
function bindDeferredContactStateUpdates(contactForm, contactElements) {
    contactForm.addEventListener('focusin', () => {
        scheduleContactFormStateUpdate(contactForm, contactElements.submitButton);
    });

    contactForm.addEventListener('click', () => {
        scheduleContactFormStateUpdate(contactForm, contactElements.submitButton);
    });
}

/**
 * Updates the form state after a short delay.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 */
function scheduleContactFormStateUpdate(contactForm, submitButton) {
    setTimeout(() => {
        updateContactFormState(contactForm, submitButton);
    }, 200);
}

/**
 * Validates a field after it loses focus and updates the form state.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 */
function handleContactFieldBlur(field, contactForm, submitButton) {
    validateContactField(field);
    updateContactFormState(contactForm, submitButton);
}

/** Updates all visual and interactive contact form states. */
function updateContactFormState(contactForm, submitButton) {
    updateContactSubmitButton(contactForm, submitButton);
    updatePrivacyCheckState(contactForm);
}

/**
 * Enables or disables the submit button based on form validity.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 */
function updateContactSubmitButton(contactForm, submitButton) {
    if (!submitButton) return;

    submitButton.disabled = !contactForm.checkValidity();
}

/** Updates the visual error state of the privacy checkbox. */
function updatePrivacyCheckState(contactForm) {
    const privacyCheck = getPrivacyCheck(contactForm);

    if (!privacyCheck) return;

    const shouldShowError = shouldShowPrivacyError(contactForm, privacyCheck.checkbox);

    privacyCheck.label.classList.toggle('privacy-check--error', shouldShowError);
}

/**
 * Returns the privacy checkbox label and input.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @returns {{label: Element, checkbox: Element}|null} The privacy checkbox elements.
 */
function getPrivacyCheck(contactForm) {
    const label = contactForm.querySelector('.privacy-check');
    const checkbox = contactForm.querySelector('.privacy-check input');

    if (!label || !checkbox) return null;

    return { label, checkbox };
}

/**
 * Checks whether the privacy checkbox error should be shown.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLInputElement} privacyCheckbox - The privacy checkbox input.
 * @returns {boolean} Whether the privacy error should be visible.
 */
function shouldShowPrivacyError(contactForm, privacyCheckbox) {
    return areContactFieldsValid(contactForm) && !privacyCheckbox.checked;
}

/**
 * Checks whether all contact form fields are valid.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @returns {boolean} Whether all fields are valid.
 */
function areContactFieldsValid(contactForm) {
    const formFields = getContactFormFields(contactForm);

    return Array.from(formFields).every(isContactFieldValid);
}

/**
 * Returns all text fields used by the contact form.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @returns {NodeListOf<HTMLInputElement|HTMLTextAreaElement>} The contact form fields.
 */
function getContactFormFields(contactForm) {
    return contactForm.querySelectorAll('.form-group input, .form-group textarea');
}

/**
 * Validates and submits the contact form.
 * @param {SubmitEvent} event - The submit event.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 * @returns {Promise<void>}
 */
async function validateContactForm(event, submitButton) {
    event.preventDefault();

    const contactForm = event.currentTarget;

    validateContactFormFields(contactForm);
    updateContactFormState(contactForm, submitButton);

    if (!contactForm.checkValidity()) return;

    if (submitButton) {
        submitButton.disabled = true;
    }

    try {
        const response = await sendContactMessage(contactForm);

        if (!response.ok) {
            throw new Error('Message could not be sent.');
        }

        showContactSuccessMessage(contactForm);
        resetContactForm(contactForm, submitButton);
    } catch (error) {
        console.error(error);
        alert('Your message could not be sent. Please try again later.');
        updateContactFormState(contactForm, submitButton);
    }
}

/**
 * Sends the contact form data to the mail endpoint.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @returns {Promise<Response>} The fetch response.
 */
function sendContactMessage(contactForm) {
    const formData = new FormData(contactForm);

    const contactData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        message: formData.get('message').trim()
    };

    return fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
    });
}

/** Validates all contact form fields. */
function validateContactFormFields(contactForm) {
    const formFields = getContactFormFields(contactForm);

    formFields.forEach((field) => {
        validateContactField(field);
    });
}

/**
 * Shows the contact success message for a short time.
 * @param {HTMLFormElement} contactForm - The contact form element.
 */
function showContactSuccessMessage(contactForm) {
    const successMessage = contactForm.querySelector('#contactSuccessMessage');

    if (!successMessage) return;

    successMessage.classList.add('is-visible');

    setTimeout(() => {
        hideContactSuccessMessage(successMessage);
    }, 3000);
}

/** Hides the contact success message. */
function hideContactSuccessMessage(successMessage) {
    successMessage.classList.remove('is-visible');
}

/**
 * Resets the contact form and its visual states.
 * @param {HTMLFormElement} contactForm - The contact form element.
 * @param {HTMLButtonElement|null} submitButton - The submit button.
 */
function resetContactForm(contactForm, submitButton) {
    contactForm.reset();

    resetContactFieldStates(contactForm);
    resetPrivacyCheckState(contactForm);
    updateContactSubmitButton(contactForm, submitButton);
}

/** Removes error states from all contact form fields. */
function resetContactFieldStates(contactForm) {
    const formGroups = contactForm.querySelectorAll('.form-group');

    formGroups.forEach((formGroup) => {
        formGroup.classList.remove('form-group--error');
    });
}

/** Removes the privacy checkbox error state. */
function resetPrivacyCheckState(contactForm) {
    const privacyCheck = contactForm.querySelector('.privacy-check');

    if (!privacyCheck) return;

    privacyCheck.classList.remove('privacy-check--error');
}

/** Validates a single contact form field. */
function validateContactField(field) {
    const formGroup = field.closest('.form-group');

    if (!formGroup) return;

    updateContactFieldErrorMessage(field, formGroup);
    formGroup.classList.toggle('form-group--error', !isContactFieldValid(field));
}

/**
 * Updates the error message for a contact form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @param {Element} formGroup - The field wrapper element.
 */
function updateContactFieldErrorMessage(field, formGroup) {
    const errorMessage = formGroup.querySelector('.form-error');

    if (!errorMessage) return;

    errorMessage.textContent = getContactFieldErrorMessage(field, errorMessage);
}

/**
 * Returns the correct error message for a contact form field.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @param {HTMLElement} errorMessage - The error message element.
 * @returns {string} The error message text.
 */
function getContactFieldErrorMessage(field, errorMessage) {
    if (isEmptyContactField(field)) {
        return errorMessage.dataset.requiredMessage || errorMessage.textContent;
    }

    if (isInvalidEmailField(field)) {
        return errorMessage.dataset.invalidMessage;
    }

    return errorMessage.textContent;
}

/**
 * Checks whether a contact form field is valid.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @returns {boolean} Whether the field is valid.
 */
function isContactFieldValid(field) {
    const fieldValue = field.value.trim();

    if (fieldValue === '') return false;

    if (field.type === 'email') {
        return isValidEmail(fieldValue);
    }

    return true;
}

/**
 * Checks whether a contact form field is empty.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @returns {boolean} Whether the field is empty.
 */
function isEmptyContactField(field) {
    return field.value.trim() === '';
}

/**
 * Checks whether an email field contains an invalid email address.
 * @param {HTMLInputElement|HTMLTextAreaElement} field - The form field.
 * @returns {boolean} Whether the email field is invalid.
 */
function isInvalidEmailField(field) {
    return field.type === 'email' && !isValidEmail(field.value.trim());
}

/** Checks whether an email address has a valid format. */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(email);
}