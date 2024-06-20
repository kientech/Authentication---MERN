import jwt from "jsonwebtoken";
import ENV from "../config.js";

// auth middleware
export default async function Auth(req, res, next) {
  try {
    // access the authorize header to validate request
    const token = req.headers.authorization.split(" ")[1];
    console.log("🚀 ~ Auth ~ token:", token);

    // retrieve the user details for the logged in user
    const decodedToken = await jwt.verify(token, ENV.JWT_SECRET);
    req.user = decodedToken;
    console.log("🚀 ~ Auth ~ decodedToken:", decodedToken)
    console.log("🚀 ~ Auth ~ req.user:", req.user);
    next();
  } catch (error) {
    return res.status(500).send({ error: "Authentication Failed" });
  }
}

export function localVariables(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
