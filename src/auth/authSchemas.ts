import * as Yup from "yup";

export const emailSchema = Yup.string().email("Invalid email").required("Required");

export const passwordSchema = Yup.string()
  .min(10, "Password must be at least 10 characters")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .required("Required");
