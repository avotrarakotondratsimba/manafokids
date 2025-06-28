import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import chatBotRouter from "./routes/chatBot.route.js";
import messageRouter from "./routes/message.route.js";
import themeRouter from "./routes/theme.route.js";
import moduleRouter from "./routes/module.route.js";
import lessonRouter from "./routes/lesson.route.js";
import kidRouter from "./routes/kid.route.js";
import divisionRouter from "./routes/division.route.js";

const app = express();

// // Vérifier les origines
// const corsOptions = {
//   origin: function (origin, callback) {
//     const allowedOrigins = ["http://localhost:5173"];

//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Accès bloqué par CORS"));
//     }
//   },
//   credentials: true,
// };

const corsOptions = {
  origin: function (origin, callback) {
    // Liste des origines bloquées (optionnelle)
    const blockedOrigins = [];

    // Autoriser toutes les origines sauf celles dans blockedOrigins
    if (!origin || !blockedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Accès bloqué par CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Middlewares basiques
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/bot", chatBotRouter);
app.use("/api/messages", messageRouter);
// app.use("/api/users", userRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/themes", themeRouter);
app.use("/api/kids", kidRouter);
app.use("/api/divisions", divisionRouter);

// Middleware de gestion d'erreur
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de Manafocoders");
});

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
