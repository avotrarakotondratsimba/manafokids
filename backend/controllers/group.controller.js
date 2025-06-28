import { PrismaClient } from "../generated/prisma/index.js";

import { errorObject } from "../middlewares/error.middleware.js";

const prisma = new PrismaClient();

// GET /api/groups
export const getGroups = async (req, res, next) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        members,
      },
    });

    res.json({ success: true, groups });
  } catch (error) {
    next(error);
  }
};

// GET /api/groups/:groupId
export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return errorObject('Le champ "groupId" est requis.', 400);
    }

    if (isNaN(parseInt(groupId, 10))) {
      return errorObject('Le champ "groupId" doit être un nombre.', 400);
    }

    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId, 10) },
      include: {
        members: true,
        admin: true,
      },
    });

    if (!group) {
      return errorObject("Groupe non trouvé.", 404);
    }

    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
};

// POST /api/groups
export const createGroup = async (req, res, next) => {
  try {
    const { groupName, avatarUrl } = req.body;

    if (!groupName) {
      return errorObject('Le champs "Nom du groupe" est requis.', 400);
    }

    const newGroup = await prisma.group.create({
      data: {
        groupName,
        adminId: req.user.userId, // Définit dans le middleware d'authentification
        ...(avatarUrl && { avatarUrl }),
      },
    });

    res.json({
      success: true,
      message: "Groupe crée avec succès",
      group: newGroup,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/groups/:groupId
export const updateGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { groupName, avatarUrl } = req.body;

    if (!groupId) {
      return errorObject('Le champ "groupId" est requis.', 400);
    }

    if (isNaN(parseInt(groupId, 10))) {
      return errorObject('Le champ "groupId" doit être un nombre.', 400);
    }

    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(groupId, 10) },
    });

    if (!existingGroup) {
      return errorObject("Groupe non trouvé.", 404);
    }

    if (existingGroup.adminId !== req.user.userId) {
      return errorObject("Vous n'êtes pas autorisé à modifier ce groupe.", 403);
    }

    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(groupId, 10) },
      data: {
        groupName,
        ...(avatarUrl && { avatarUrl }),
      },
    });

    res.json({
      success: true,
      message: "Groupe mis à jour avec succès",
      group: updatedGroup,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/groups/:groupId
export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    if (!groupId) {
      return errorObject('Le champ "groupId" est requis.', 400);
    }

    if (isNaN(parseInt(groupId, 10))) {
      return errorObject('Le champ "groupId" doit être un nombre.', 400);
    }

    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(groupId, 10) },
    });

    if (!existingGroup) {
      return errorObject("Groupe non trouvé.", 404);
    }

    if (existingGroup.adminId !== req.user.userId) {
      return errorObject(
        "Vous n'êtes pas autorisé à supprimer ce groupe.",
        403
      );
    }

    await prisma.group.delete({
      where: { id: parseInt(groupId, 10) },
    });

    res.json({ success: true, message: "Groupe supprimé avec succès." });
  } catch (error) {
    next(error);
  }
};
