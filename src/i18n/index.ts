import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import pl from './pl.json';
import {setLocale} from "yup";

setLocale({
    mixed: {
        required: "Pole jest wymagane",
    },
    string: {
        email: "Nieprawidłowy adres email",
        min: "Za krótki tekst",
    },
});

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources: {
            en: {translation: en},
            pl: {translation: pl},
        },
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;

