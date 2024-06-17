import axios from "axios";
import { jwtDecode } from "jwt-decode";

const URL = "http://localhost:8080";

// Make API request

/** To get username from Token */
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwtDecode(token);
  return decode;
}
// Authenticate function
export async function authenticate(username) {
  try {
    return await axios.post(`${URL}/api/authenticate`, { username });
  } catch (error) {
    return {
      error: "Username doesn't exist...!",
    };
  }
}

// Get User Detail
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`${URL}/api/user/${username}`);
    return { data };
  } catch (error) {
    return {
      error: "Password doesn't Match...! ",
    };
  }
}

// Register user function
export async function registerUser(credentials) {
  try {
    const {
      data: { message },
      status,
    } = await axios.post(`${URL}/api/register`, credentials);

    let { username, email } = credentials;

    // send email
    if (status === 201) {
      await axios.post(`${URL}/api/registerMail`, {
        username,
        userEmail: email,
        text: message,
      });
    }

    return Promise.resolve(message);
  } catch (error) {
    return Promise.reject({ error });
  }
}

// Login Function
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post(`${URL}/api/login`, {
        username,
        password,
      });
      return Promise.resolve(data);
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
}

// update user profile function
export async function updateUser(response) {
  try {
    const token = await localStorage.getItem("token");
    const data = await axios.patch(`${URL}/api/updateUser`, response, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject({ error: "Couldn't Update User Profile...!" });
  }
}

// generate OTP
export async function generateOTP(username) {
  try {
    const {
      data: { code },
      status,
    } = await axios.get(`${URL}/api/generateOTP`, { params: { username } });

    // send mail with the OTP
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });
      let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
      await axios.post(`${URL}/api/registerMail`, {
        username,
        userEmail: email,
        text,
        subject: "Password Recovery OTP",
      });
    }
    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({ error });
  }
}

/** verify OTP */
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get(`${URL}/api/verifyOTP`, {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return Promise.reject(error);
  }
}

/** reset password */
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put(`${URL}/api/resetPassword`, {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
