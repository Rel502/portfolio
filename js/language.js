// Language switch logic

const LANGUAGE_STORAGE_KEY = 'portfolioLanguage';

let currentTranslations = {};

function setupLanguageSwitch() {
    bindLanguageButtons();
    loadSavedLanguage();
}

function bindLanguageButtons() {
    const languageButtons = document.querySelectorAll('.language-btn[data-lang]');

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            handleLanguageButtonClick(button);
        });
    });
}

function handleLanguageButtonClick(button) {
    const selectedLanguage = button.dataset.lang;

    saveSelectedLanguage(selectedLanguage);
    setActiveLanguageButton(selectedLanguage);
    loadLanguageFile(selectedLanguage);
}

function loadSavedLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (!savedLanguage) return;

    setActiveLanguageButton(savedLanguage);
    loadLanguageFile(savedLanguage);
}

function saveSelectedLanguage(language) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

function setActiveLanguageButton(language) {
    const languageButtons = document.querySelectorAll('.language-btn[data-lang]');

    languageButtons.forEach((button) => {
        const isSelectedLanguage = button.dataset.lang === language;
        button.classList.toggle('active', isSelectedLanguage);
    });
}

async function loadLanguageFile(language) {
    const response = await fetch(`./i18n/${language}.json`);
    const translations = await response.json();

    currentTranslations = translations;
    document.documentElement.lang = language;
    translatePage(translations);
}

function getCurrentTranslation(key, fallbackText) {
    const translatedText = getTranslation(currentTranslations, key);

    if (!translatedText) return fallbackText;

    return translatedText;
}

function getTranslation(translations, key) {
    return key.split('.').reduce((currentValue, keyPart) => {
        if (!currentValue) return null;

        return currentValue[keyPart];
    }, translations);
}

function translatePage(translations) {
    translateTextContent(translations);
    translateHtmlContent(translations);
    translateAriaLabels(translations);
    translateFormMessages(translations);
}

function translateHtmlContent(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-html]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18nHtml;
        const translatedHtml = getTranslation(translations, translationKey);

        if (!translatedHtml) return;

        element.innerHTML = translatedHtml;
    });
}

function translateFormMessages(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-required-message], [data-i18n-invalid-message]');

    translatableElements.forEach((element) => {
        translateDataAttribute(element, translations, 'i18nRequiredMessage', 'requiredMessage');
        translateDataAttribute(element, translations, 'i18nInvalidMessage', 'invalidMessage');
    });
}

function translateDataAttribute(element, translations, i18nDatasetKey, targetDatasetKey) {
    const translationKey = element.dataset[i18nDatasetKey];

    if (!translationKey) return;

    const translatedText = getTranslation(translations, translationKey);

    if (!translatedText) return;

    element.dataset[targetDatasetKey] = translatedText;
}

function translateTextContent(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18n;
        const translatedText = getTranslation(translations, translationKey);

        if (!translatedText) return;

        element.textContent = translatedText;
    });
}

function translateAriaLabels(translations) {
    const translatableElements = document.querySelectorAll('[data-i18n-aria-label]');

    translatableElements.forEach((element) => {
        const translationKey = element.dataset.i18nAriaLabel;
        const translatedText = getTranslation(translations, translationKey);

        if (!translatedText) return;

        element.setAttribute('aria-label', translatedText);
    });
}