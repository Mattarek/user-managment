import * as Yup from 'yup';
import { type TFunction } from 'i18next';
import { MIN_PASSWORD_LENGTH } from '../constants.ts';

export const getLoginSchema = (t: TFunction) =>
  Yup.object({
    email: Yup.string().email(t('validation.emailRequired')).required(t('validation.emailRequired')),

    password: Yup.string()
      .required(t('validation.passwordRequired'))
      .min(MIN_PASSWORD_LENGTH, t('validation.passwordMin', { min: MIN_PASSWORD_LENGTH })),
  });

export const getRegisterSchema = (t: TFunction) =>
  Yup.object({
    email: Yup.string().email(t('validation.emailRequired')).required(t('validation.emailRequired')),

    name: Yup.string()
      .matches(/^[A-Z][a-z]+$/, t('validation.invalidNameFormat'))
      .required(t('validation.nameRequired')),

    surname: Yup.string()
      .matches(/^[A-Z][a-z]+$/, t('validation.invalidSurnameFormat'))
      .required(t('validation.surnameRequired')),

    password: Yup.string()
      .required(t('validation.passwordRequired'))
      .min(MIN_PASSWORD_LENGTH, t('validation.passwordMin', { min: MIN_PASSWORD_LENGTH })),

    repeatedPassword: Yup.string()
      .required(t('validation.passwordRepeatRequired'))
      .oneOf([Yup.ref('password')], t('validation.passwordNotMatch')),

    terms: Yup.boolean().oneOf([true], t('validation.acceptTermsRequired')),
  });

export const getForgotSchema = (t: TFunction) =>
  Yup.object({
    email: Yup.string().email(t('validation.emailRequired')).required(t('validation.required')),
  });
