const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

// Function to generate OTP
function generateOTP(length) {
  const chars = "0123456789"; // Characters to use for OTP generation
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER, //sender mail address
    pass: process.env.APP_PASSWORD, //Gmaill App password
  },
});

const otpLength = 6; // Length of the OTP (e.g., 6 digits)
const otp = generateOTP(otpLength); // Generate OTP

const mailOptions = {
  from: "Sample Authentication App <" + process.env.USER + ">",
  to: ["immarksalem007@gmail.com"],
  subject: "Account One-time Password",
  html: `
        <p>Dear User,</p>
        <p>Thank you for signing up with our service. Your One-Time Password (OTP) for account verification is: </p>
        <p style="text-align: center;"><span style="font-size: 32px; display: inline-block;">${otp}</span></p>
        <p>Please use this OTP to complete the verification process within the next 5 minutes.</p>
        <p>If you did not request this OTP, please disregard this email.</p>
        <p>Best regards,</p>
        <p>Sample Authentication App</p>
    `,
};

const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
  } catch (error) {
    console.error(error);
  }
};

sendMail(transporter, mailOptions);
