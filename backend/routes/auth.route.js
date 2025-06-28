import { Router } from "express";
import {
  signIn,
  signOut,
  signUp,
  verify2FACode,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/auth.controller.js";
import { googleSignIn } from "../controllers/googleSignIn.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);

authRouter.post("/sign-in", signIn);

authRouter.post("/refresh-token", refreshToken);

authRouter.post("/2fa", verify2FACode);

authRouter.post("/sign-out", signOut);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password", resetPassword);

authRouter.post("/google", googleSignIn);

export default authRouter;
