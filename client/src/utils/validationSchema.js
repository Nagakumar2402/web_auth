import * as Yup from "yup";

const validationSchemaRegister = Yup.object().shape({
  username: Yup.string()
    .min(5, "Too Short!")
    .max(16, "Too Long!")
    .required("name is required"),

  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      "Invalid email address"
    )
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 ")
    .max(16, "Password must be less than 16 ")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least L3t$Go!"
    )
    .required("Password is required"),

  fullName: Yup.string().required("fullName is required"),
});

const validationSchemaLogin = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      "Invalid email address"
    )
    .required("Email is required"),
  // password: Yup.string()
  //   .min(8, "Password must be at least 8 ")
  //   .max(16, "Password must be less than 16 ")
  //   .matches(
  //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
  //     "Password must contain at least L3t$Go!"
  //   )
  //   .required("Password is required"),
});

export { validationSchemaRegister, validationSchemaLogin };
