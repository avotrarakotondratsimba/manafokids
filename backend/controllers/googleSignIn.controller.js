import { PrismaClient } from "../generated/prisma/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

import { GOOGLE_CLIENT_ID, JWT_SECRET } from "../config/env.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import generateCode from "../utils/generateCode.js";
import sendMail from "../utils/sendMail.js";
import { triggerEmailService } from "../services/n8n.service.js";

const prisma = new PrismaClient();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export const googleSignIn = async (req, res, next) => {
  try {
    const { tokenId } = req.body;

    // Vérification du token Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name: userName,
      picture: profilePicture,
    } = payload;

    // Recherche ou création de l'utilisateur
    let user = await prisma.user.findUnique({ where: { googleId } });

    if (!user) {
      // Vérifier si un user existe déjà avec le même email
      user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, profilePicture },
        });
      } else {
        user = await prisma.user.create({
          data: {
            email,
            userName,
            googleId,
            profilePicture,
          },
        });

        // DÉCLENCHEMENT DE L'EMAIL DE BIENVENUE VIA N8N
        // triggerEmailService("welcome", user.email, {
        //   name: user.userName,
        // });
      }
    }

    // Vérifier si la double authentification est activée
    if (user.twoFactorEnabled) {
      const code = generateCode();
      const expiry = new Date(Date.now() + 5 * 60 * 1000);
      await prisma.user.update({
        where: { userId: user.userId },
        data: { twoFactorCode: code, twoFactorCodeExpiry: expiry },
      });

      const tempToken = jwt.sign(
        { userId: user.userId, twoFactorPending: true },
        JWT_SECRET,
        { expiresIn: "5m" }
      );

      // DÉCLENCHEMENT DE L'EMAIL 2FA VIA N8N
      // triggerEmailService("2fa-code", user.email, {
      //   name: user.userName,
      //   data: { code: code },
      // });

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

      await sendMail(user.email, "Code de vérification", emailContent);

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

    res.status(200).json({
      success: true,
      message: "Connexion via Google réussie",
      data: { accessToken, user },
    });
  } catch (error) {
    next(error);
  }
};
