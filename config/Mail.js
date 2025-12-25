import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const sentMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL,
      to,
      subject: "Reset your password",
      html: `<p>Your OTP for reset password is: <b>${otp}</b></p>`, 
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

export default sentMail;
