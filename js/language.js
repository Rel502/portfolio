// Language switch logic

const LANGUAGE_STORAGE_KEY = 'portfolioLanguage';

let currentTranslations = {};

/** Initializes the language switch and loads the saved language. */
function setupLanguageSwitch() {
    bindLanguageButtons();
    loadSavedLanguage();
}

/** Binds click events to all language buttons. */
function bindLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn[data-lang]');

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            handleLanguageButtonClick(button);
        });
    });
}

/**
 * Handles a language button click.
 * @param {HTMLElement} button - The clicked language button.
 */
function handleLanguageButtonClick(button) {
    const selectedLanguage = button.dataset.lang;

    saveSelectedLanguage(selectedLanguage);
    setActiveLanguageButton(selectedLanguage);
    loadLanguageFile(selectedLanguage);
}

/** Loads the saved language from local storage. */
function loadSavedLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'en';

    setActiveLanguageButton(savedLanguage);
    loadLanguageFile(savedLanguage);
}

/**
 * Saves the selected language to local storage.
 * @param {string} language - The selected language code.
 */
function saveSelectedLanguage(language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

/**
 * Updates the active state of the language buttons.
 * @param {string} language - The active language code.
 */
function setActiveLanguageButton(language) {
    const languageButtons = document.querySelectorAll('.language-btn[data-lang]');

    languageButtons.forEach((button) => {
        const isSelectedLanguage = button.dataset.lang === language;
        button.classList.toggle('active', isSelectedLanguage);
    });
}

/**
 * Loads and applies a language file.
 * @param {string} language - The language code to load.
 * @returns {Promise<void>}
 */
async function loadLanguageFile(language) {
    const response = await fetch(`./i18n/${language}.json`);
    const translations = await response.json();

    currentTranslations = translations;
    document.documentElement.lang = language;
    translatePage(translations);
}

/**
 * Returns the current translation or a fallback text.
 * @param {string} key - The translation key.
 * @param {string} fallbackText - The fallback text.
 * @returns {string} The translated or fallback text.
 */
function getCurrentTranslation(key, fallbackText) {
    const translatedText = getTranslation(currentTranslations, key);

    if (!translatedText) return fallbackText;

    return translatedText;
}

/**
 * Resolves a nested translation key.
 * @param {Object} translations - The translation object.
 * @param {string} key - The dot-separated translation key.
 * @returns {string|null} The resolved translation text.
 */
function getTranslation(translations, key) {
    return key.split('.').reduce((currentValue, keyPart) => {
        if (!currentValue) return null;

        return currentValue[keyPart];
    }, translations);
}

/**
 * Applies all translations to the page.
 * @param {Object} translations - The translation object.
 */
function translatePage(translations) {
    translateTextContent(translations);
    translateHtmlContent(translations);
    translateAriaLabels(translations);
    translateFormMessages(translations);
}

/**
 * Translates elements that contain HTML content.
 * @param {Object} translations - The translation object.
 */
function translateHtmlContent(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-html]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18nHtml;
        const translatedHtml = getTranslation(translations, translationKey);

        if (!translatedHtml) return;

        element.innerHTML = translatedHtml;
    });
}

/**
 * Translates form validation messages stored in data attributes.
 * @param {Object} translations - The translation object.
 */
function translateFormMessages(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-required-message], [data-i18n-invalid-message]');

    translatableElements.forEach((element) => {
        translateDataAttribute(element, translations, 'i18nRequiredMessage', 'requiredMessage');
        translateDataAttribute(element, translations, 'i18nInvalidMessage', 'invalidMessage');
    });
}

/**
 * Copies a translated value into a target data attribute.
 * @param {HTMLElement} element - The element with translation data.
 * @param {Object} translations - The translation object.
 * @param {string} i18nDatasetKey - The source dataset key.
 * @param {string} targetDatasetKey - The target dataset key.
 */
function translateDataAttribute(element, translations, i18nDatasetKey, targetDatasetKey) {
    const translationKey = element.dataset[i18nDatasetKey];

    if (!translationKey) return;

    const translatedText = getTranslation(translations, translationKey);

    if (!translatedText) return;

    element.dataset[targetDatasetKey] = translatedText;
}

/**
 * Translates plain text content.
 * @param {Object} translations - The translation object.
 */
function translateTextContent(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18n;
        const translatedText = getTranslation(translations, translationKey);

        if (!translatedText) return;

        element.textContent = translatedText;
    });
}

/**
 * Translates aria-label attributes.
 * @param {Object} translations - The translation object.
 */
function translateAriaLabels(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-aria-label]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18nAriaLabel;
        const translatedText = getTranslation(translations, translationKey);

        if (!translatedText) return;

        element.setAttribute('aria-label', translatedText);
    });
}