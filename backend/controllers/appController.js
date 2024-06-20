import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";

// middleware for verify user
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;
    // Check for existing username
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: "Please use a unique username" });
    }

    // Check for existing email
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Please use a unique email" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save the user
    await user.save();
    return res.status(201).send({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    // Compare the provided password with the stored hashed password
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Send a success response with the token
    return res.status(200).send({
      msg: "Login successful!",
      username: user.username,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
}

export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(400).send({ error: "Invalid Username" });
    }

    // Find the user by username
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Couldn't find the user" });
    }

    // remove password from the user object
    const { password, ...rest } = Object.assign({}, user.toJSON());

    // Send the user data
    return res.status(200).send(rest);
  } catch (error) {
    return res.status(500).send({ error: "Cannot find User Data" });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    console.log("🚀 ~ updateUser ~ userId:", userId);

    if (!userId) {
      return res.status(401).send({ error: "User Not Found...!" });
    }

    const body = req.body;

    try {
      const result = await UserModel.updateOne({ _id: userId }, body);
      if (result.nModified === 0) {
        return res
          .status(400)
          .send({
            message:
              "No records updated. The provided data might be identical to existing data.",
          });
      }

      return res.status(200).send({ message: "Record Updated...!" });
    } catch (updateError) {
      console.error("Error updating user record:", updateError);
      return res.status(500).send({ error: "Failed to update user record." });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send({ error: "An unexpected error occurred." });
  }
}

export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({
    code: req.app.locals.OTP,
  });
}

export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(440).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not Found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false; // reset session
    return res.status(201).send({ msg: "Record Updated...!" });
  } catch (error) {
    if (error.message.includes("Username not Found")) {
      return res.status(404).send({ error: error.message });
    }
    return res.status(500).send({ error: "Internal Server Error" });
  }
}
