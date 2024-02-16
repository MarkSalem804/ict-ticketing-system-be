// authentication-service.js
const authenticationDao = require("../DAO/authentication-dao");
const nodemailer = require("nodemailer");
require("dotenv").config();

function generateOTP(length) {
  const chars = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
}

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Sample Authentication App <${process.env.USER}>`,
    to: email,
    subject: "Account One-time Password",
    html: `
      <p>Dear User,</p>
      <p>Your Registration is successful. Your One-Time Password (OTP) for account verification is: </p>
      <p style="text-align: center;"><span style="font-size: 32px; display: inline-block;">${otp}</span></p>
      <p>Please use this OTP to complete the verification process within the next 5 minutes.</p>
      <p>If you did not request this OTP, please disregard this email.</p>
      <p>Best regards,</p>
      <p>Sample Authentication App</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Error sending email");
  }
}

async function verifyOTP(email, otp) {
  // Retrieve the user from the database using the email
  const user = await authenticationDao.findUserByEmail(email);

  // Check if the user exists and if the OTP matches
  if (user && user.otp === otp) {
    return true; // OTP is valid
  } else {
    return false; // OTP is invalid
  }
}

async function registerUserFirstStep(data) {
  const { email } = data;

  try {
    const existingUser = await authenticationDao.findUserByEmail(email);
    if (existingUser) {
      return { message: "User already exists" };
    }

    const length = 6;
    const otp = generateOTP(length);

    await authenticationDao.updateUserOTP(email, otp);

    await sendOTP(email, otp);

    return { message: "OTP sent successfully" };
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function registerUserSecondStep(data) {
    const { email, otp } = data;
  
    try {
      // Retrieve user from database using email
      const user = await authenticationDao.findUserByEmail(email);
  
      // Check if user exists and if OTP matches
      if (!user || user.otp !== otp) {
        throw new Error("Invalid OTP");
      }
  
      // If OTP is correct, proceed with user registration
      await authenticationDao.updateUserOTP(email, null); // Clear OTP from database
  
      // Proceed with user registration (implementation not shown here)
  
      return { message: "User registered successfully" };
    } catch (error) {
      console.error("Error!", error);
      throw new Error("Error in Process");
    }
  }

module.exports = {
  generateOTP,
  sendOTP,
  registerUserFirstStep,
  registerUserSecondStep,
};
