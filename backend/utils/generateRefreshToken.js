import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_EXPIRES_IN } from "../config/env.js";

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

export default generateRefreshToken;
