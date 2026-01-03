import * as Yup from "yup";
import {type TFunction} from "i18next";

export const minPasswordLength = 10;

export const getLoginSchema = (t: TFunction) =>
    Yup.object({
        email: Yup.string()
            .email(t("validation.emailRequired"))
            .required(t("validation.emailRequired")),
        password: Yup.string()
            .required(t("validation.passwordRequired")),
    });

export const getRegisterSchema = (t: TFunction) =>
    Yup.object({
        email: Yup.string()
            .email(t("validation.emailRequired"))
            .required(t("validation.emailRequired")),

        name: Yup.string()
            .matches(/^[A-Z][a-z]+$/, t("validation.invalidNameFormat"))
            .required(t("validation.nameRequired")),

        surname: Yup.string()
            .matches(/^[A-Z][a-z]+$/, t("validation.invalidSurnameFormat"))
            .required(t("validation.surnameRequired")),

        password: Yup.string()
            .required(t("validation.passwordRequired"))
            .min(minPasswordLength, t("validation.passwordMin", {min: minPasswordLength})),

        confirmPassword: Yup.string()
            .required(t("validation.passwordConfirmRequired"))
            .oneOf([Yup.ref("password")], t("validation.passwordNotMatch")),
    });

export const getForgotSchema = (t: TFunction) =>
    Yup.object({
        email: Yup.string()
            .email(t("validation.emailRequired"))
            .required(t("validation.required")),
    });

