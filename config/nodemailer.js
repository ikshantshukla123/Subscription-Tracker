import nodemailer from "nodemailer"
import { PASSWORD } from "./env.js";



export const accountEmail = 'Your email';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,  // ✅ string fixed
    pass: PASSWORD
  }
});

export default transporter;