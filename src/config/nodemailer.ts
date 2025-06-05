import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: true,
  port: 587,
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
