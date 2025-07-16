import nodemailer from "nodemailer"
import { PASSWORD } from "./env.js";



export const accountEmail = 'ikshantshukla24@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: accountEmail,  // ✅ string fixed
    pass: PASSWORD
  }
});

export default transporter;