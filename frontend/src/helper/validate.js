import toast from "react-hot-toast";

function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required...");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username...");
  }
  return error;
}

function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (!values.password) {
    error.password = toast.error("Password Required...");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Wrong Password...");
  } else if (values.password.length < 4) {
    error.password = toast.error("Password must be more than 4 characters!");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character!");
  }
  return error;
}

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);
  return errors;
}

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);
  return errors;
}
