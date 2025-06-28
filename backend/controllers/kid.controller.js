import { PrismaClient } from "../generated/prisma/index.js";

import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/kids/
export const getKids = async (req, res, next) => {
  try {
    const kids = await prisma.kid.findMany({
      where: {
        parentId: req.user.userId, // Définit dans le middleware d'authentification
      },
      include: {
        parent: {
          select: {
            userId: true,
            userName: true,
            email: true,
          },
        },
      },
    });

    res.json({ success: true, kids });
  } catch (error) {
    next(error);
  }
};

// POST /api/kids/
export const insertKid = async (req, res, next) => {
  try {
    const { kidUserName, birthDate, sessionDuration, avatarUrl } = req.body;
    let ageGroup;

    // Vérification des champs requis
    if (!kidUserName || !birthDate || !sessionDuration) {
      errorObject(
        'Les champs "kidUserName", "birthDate", "sessionDuration" sont requis.',
        400
      );
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 5 || age > 12) {
      errorObject(
        "L'âge de l'enfant doit être compris entre 5 et 12 ans.",
        400
      );
    }

    const newKid = await prisma.kid.create({
      data: {
        kidUserName,
        birthDate: new Date(birthDate), // au format ISO ou yyyy-mm-dd
        sessionDuration,
        profilePic: avatarUrl || null,
        ageGroup,
        userId: req.user.userId, // Définit dans le middleware d'authentification
      },
    });

    res.status(201).json({
      success: true,
      message: "Enfant enregistré avec succès",
      kid: newKid,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/kids/:kidId
export const updateKid = async (req, res, next) => {
  try {
    const { kidId } = req.params;
    const { kidUserName, birthDate, sessionDuration, avatarUrl } = req.body;

    // Vérification des champs requis
    if (!kidUserName || !birthDate || !sessionDuration) {
      errorObject(
        'Les champs "kidUserName", "birthDate", "sessionDuration" sont requis.',
        400
      );
    }

    const existingKid = await prisma.kid.findUnique({
      where: { kidId: parseInt(kidId) },
    });

    if (!existingKid) {
      errorObject("Enfant non trouvé.", 404);
    }

    if (existingKid.userId !== req.user.userId) {
      errorObject("Vous n'êtes pas autorisé à modifier cet enfant.", 403);
    }

    const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
    if (age < 5 || age > 12) {
      errorObject(
        "L'âge de l'enfant doit être compris entre 5 et 12 ans.",
        400
      );
    }

    const updatedKid = await prisma.kid.update({
      where: { kidId: parseInt(kidId) },
      data: {
        kidUserName,
        birthDate: new Date(birthDate),
        sessionDuration,
        profilePic: avatarUrl || null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Enfant mis à jour avec succès",
      kid: updatedKid,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/kids/xp/:kidId
export const updateKidXp = async (req, res, next) => {
  try {
    const { kidId } = req.params;
    const { xp } = req.body;

    if (!kidId || isNaN(parseInt(kidId, 10))) {
      errorObject('Le champ "kidId" est invalide.', 400);
    }
    if (!xp || isNaN(parseInt(xp, 10))) {
      errorObject('Le champ "xp" est requis et doit être un nombre.', 400);
    }
    if (xp <= 0) {
      errorObject(
        'Le champ "xp" ne peut pas être plus petit ou égal à 0.',
        400
      );
    }

    const existingKid = await prisma.kid.findUnique({
      where: { kidId: parseInt(kidId, 10) },
    });

    if (!existingKid) {
      errorObject("Compte enfant non trouvé.", 404);
    }

    if (existingKid.userId !== req.user.userId) {
      errorObject(
        "Vous n'êtes pas autorisé à modifier les XP de cet enfant.",
        403
      );
    }

    const updatedKid = await prisma.kid.update({
      where: { kidId: parseInt(kidId, 10) },
      data: {
        weekXp: {
          increment: parseInt(xp, 10),
        },
        totalXp: {
          increment: parseInt(xp, 10),
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "XP de l'enfant mis à jour avec succès",
      kid: updatedKid,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/kids/:kidId
export const deleteKid = async (req, res, next) => {
  try {
    const { kidId } = req.params;

    if (!kidId) {
      errorObject('Le champ "kidId" est requis.', 400);
    }

    if (isNaN(parseInt(kidId, 10))) {
      errorObject('Le champ "kidId" doit être un nombre.', 400);
    }

    const existingKid = await prisma.kid.findUnique({
      where: { kidId: parseInt(kidId, 10) },
    });

    if (!existingKid) {
      errorObject("Ce compte enfant n'est pas trouvé.", 404);
    }

    if (existingKid.userId !== req.user.userId) {
      errorObject(
        "Vous n'êtes pas autorisé à supprimer ce compte enfant.",
        403
      );
    }

    await prisma.kid.delete({
      where: { kidId: parseInt(kidId, 10) },
    });

    res.json({
      success: true,
      message: "Compte enfant supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
