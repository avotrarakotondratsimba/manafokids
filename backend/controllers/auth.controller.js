import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_EXPIRES_IN, JWT_SECRET, FRONT_URL } from "../config/env.js";
import { errorObject } from "../middlewares/error.middleware.js";
import captchaVerification from "../utils/captchaVerification.js";
import emailVerification from "../utils/emailVerification.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import sendMail from "../utils/sendMail.js";
import generateCode from "../utils/generateCode.js";

import { triggerEmailService } from "../services/n8n.service.js";

const prisma = new PrismaClient();

// SIGN UP
export const signUp = async (req, res, next) => {
  try {
    const { userName, email, password, role, captchaToken } = req.body;
    if (!userName || !email || !password) errorObject("Champs manquants", 400);
    // if (!captchaToken) errorObject("Captcha manquant", 400);

    // await captchaVerification(captchaToken);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      errorObject("Le format de l'email est invalide", 400);

    await emailVerification(email);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) errorObject("L'utilisateur existe déjà", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        ...(role && { role }),
      },
    });

    // DÉCLENCHEMENT DE L'EMAIL DE BIENVENUE VIA N8N
    // triggerEmailService("welcome", newUser.email, { name: newUser.userName });

    const { password: _, ...userWithoutPassword } = newUser;

    const accessToken = generateAccessToken(newUser.userId);
    const refreshToken = generateRefreshToken(newUser.userId);

    res.cookie("ref_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      data: { accessToken, user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// SIGN IN
export const signIn = async (req, res, next) => {
  try {
    const { email, password, captchaToken } = req.body;

    if (!email || !password) errorObject("Champs manquants", 400);
    // if (!captchaToken) errorObject("Captcha manquant", 400);

    // await captchaVerification(captchaToken);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      errorObject("Le format de l'email est invalide", 400);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) errorObject("Utilisateur introuvable", 404);

    // Si l'utilisateur n'a pas de mot de passe (par exemple, s'il s'est inscrit via Google)
    if (!user.password) errorObject("Mot de passe invalide", 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) errorObject("Mot de passe invalide", 401);

    if (user.twoFactorEnabled) {
      const code = generateCode();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      await prisma.user.update({
        where: { userId: user.userId },
        data: { twoFactorCode: code, twoFactorCodeExpiry: expiry },
      });

      const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #333;">Code de vérification 2FA</h2>
          <p style="font-size: 15px; color: #555;">Bonjour ${user.userName},</p>
          <p style="font-size: 15px; color: #555;">
            Voici votre code de vérification à deux facteurs :
          </p>
          <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin: 20px 0; padding: 15px; background-color: #eeeeee; text-align: center; border-radius: 4px;">
            ${code}
          </div>
          <p style="font-size: 13px; color: #888;">
            Ce code est valable pendant 5 minutes. Si vous n’avez pas demandé ce code, vous pouvez ignorer cet e-mail.
          </p>
        </div>
      `;

      const tempToken = jwt.sign(
        { userId: user.userId, twoFactorPending: true },
        JWT_SECRET,
        { expiresIn: "5m" }
      );

      await sendMail(user.email, "Code de vérification", emailContent);

      // DÉCLENCHEMENT DE L'EMAIL 2FA VIA N8N
      // triggerEmailService("2fa-code", user.email, {
      //   name: user.userName,
      //   data: { code: code },
      // });

      return res.status(200).json({
        success: true,
        message: "Code envoyé par email",
        data: { tempToken },
      });
    }

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    res.cookie("ref_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: { accessToken, user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

// VERIFY 2FA
export const verify2FACode = async (req, res, next) => {
  try {
    const { tempToken, code } = req.body;
    const decoded = jwt.verify(tempToken, JWT_SECRET);

    if (!decoded.twoFactorPending) errorObject("Token invalide", 401);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    if (!user || !user.twoFactorCode || !user.twoFactorCodeExpiry)
      errorObject("Code 2FA manquant ou expiré", 400);

    if (user.twoFactorCode !== code) errorObject("Code 2FA incorrect", 401);

    if (user.twoFactorCodeExpiry < new Date()) errorObject("Code expiré", 401);

    await prisma.user.update({
      where: { userId: user.userId },
      data: { twoFactorCode: null, twoFactorCodeExpiry: null },
    });

    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({
      success: true,
      message: "Connexion validée",
      data: { token, user: userWithoutPassword },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ error: "Token expiré" });

    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ error: "Token invalide" });

    next(error);
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.ref_token;

    if (!token) {
      // Si il n'y a pas encore un refresh token au montage de l'application
      if (req.query.silent === "true") {
        return res.status(200).json({ authenticated: false });
      }
      errorObject("Aucun token trouvé", 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "refresh")
      return res.status(401).json({ error: "Token invalide" });

    const userId = decoded.userId;

    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    res.cookie("ref_token", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }
    next(error);
  }
};

// SIGN OUT (juste supprimer le cookie)
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("ref_token");
    res.status(200).json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    next(error);
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  try {
    const { email, captchaToken } = req.body;

    if (!email) errorObject("Email manquant", 400);
    if (!captchaToken) errorObject("Captcha manquant", 400);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      errorObject("Le format de l'email est invalide", 400);

    await captchaVerification(captchaToken);

    const user = await prisma.user.findUnique({
      where: { email },
      select: { userId: true, userName: true, email: true },
    });
    if (!user) {
      // Ne pas révéler que l'email n'existe pas pour des raisons de sécurité
      return res.status(200).json({
        success: true,
        message: "Si l'email existe, un lien de réinitialisation a été envoyé",
      });
    }

    const resetToken = jwt.sign(
      { userId: user.userId, type: "password-reset" },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `${FRONT_URL}/reset-password?token=${resetToken}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333;">Réinitialisation de votre mot de passe</h2>
        <p style="font-size: 15px; color: #555;">Bonjour ${user.userName},</p>
        <p style="font-size: 15px; color: #555;">
          Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous :
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}"
            style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="font-size: 13px; color: #888;">
          Ce lien expirera dans 15 minutes. Si vous n’avez pas fait cette demande, vous pouvez ignorer cet e-mail.
        </p>
      </div>
    `;

    await sendMail(email, "Réinitialisation de mot de passe", emailContent);

    // ✅ DÉCLENCHEMENT DE L'EMAIL DE RÉINITIALISATION VIA N8N
    // triggerEmailService("forgot-password", user.email, {
    //   name: user.userName,
    //   data: { resetLink: resetLink },
    // });

    res.status(200).json({
      success: true,
      message: "Un lien de réinitialisation a été envoyé à votre adresse email",
    });
  } catch (error) {
    next(error);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "password-reset")
      return res.status(401).json({ error: "Token invalide" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { userId: decoded.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Lien expiré" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token invalide" });
    }

    next(error);
  }
};
