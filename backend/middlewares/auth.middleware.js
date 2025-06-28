import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/index.js";
import { errorObject } from "./error.middleware.js";

const prisma = new PrismaClient();

export const authorize = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      errorObject("Vous n'êtes pas autorisé à effectuer cette action", 401);

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
    });

    if (!user)
      errorObject("Vous n'êtes pas autorisé à effectuer cette action", 401);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user || req.client.role !== "admin")
      errorObject("Cette action est réservée aux administrateurs", 401);

    next();
  } catch (error) {
    next(error);
  }
};
