import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
  PrismaClientInitializationError,
} from "@prisma/client/runtime/library";

export const errorObject = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  throw error;
};

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const message = `Valeur du champ déjà utilisée.`;
      error = new Error(message);
      error.statusCode = 400;
    }

    if (err.code === "P2025") {
      const message = `Ressource introuvable.`;
      error = new Error(message);
      error.statusCode = 404;
    }
  }

  if (err instanceof PrismaClientValidationError) {
    const message = `Échec de la validation des données : ${err.message}`;
    error = new Error(message);
    error.statusCode = 400;
  }

  if (err instanceof PrismaClientInitializationError) {
    const message = `Erreur de connexion à la base de données.`;
    error = new Error(message);
    error.statusCode = 500;
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Erreur du serveur." });
};
