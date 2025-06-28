import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export default async function sendMail(to, subject, htmlContent) {
  await transporter.sendMail({
    from: `"Manafocoders" <${EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
}
