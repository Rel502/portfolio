// Language switch logic

function setupLanguageSwitch() {
    const languageButtons = document.querySelectorAll('.language-btn[data-lang]');

    languageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const selectedLanguage = button.dataset.lang;

            setActiveLanguageButton(selectedLanguage);
            loadLanguageFile(selectedLanguage);
        });
    });
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

    translatePage(translations);
}

function getTranslation(translations, key) {
    return key.split('.').reduce((currentValue, keyPart) => {
        if (!currentValue) return null;

        return currentValue[keyPart];
    }, translations);
}

function translatePage(translations) {
    translateTextContent(translations);
    translateAriaLabels(translations);
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