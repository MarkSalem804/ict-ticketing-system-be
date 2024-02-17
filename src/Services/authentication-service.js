const authenticationDao = require("../DAO/authentication-dao");
const nodemailer = require("nodemailer");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');


function generateOTP(length) {
  const chars = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    otp += chars[randomIndex];
  }
  return otp;
}

function generateJWTToken(user) {
  // Extract relevant user information for token payload
  const payload = {
    userId: user.userId,
    // Add any other relevant user data here
  };
  // Sign JWT token with a secret key and set expiration time (e.g., 1 hour)
  return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: '1h' });
}

async function getAll() {
  try {
    const users = await authenticationDao.getAllUsers();

    return users;
  } catch (error) {

  }
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
  const { email, firstName, middleName, lastName, password } = data;

  try {
    // Check if user already exists
    const existingUser = await authenticationDao.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Generate OTP
    const otpLength = 6;
    const otp = generateOTP(otpLength);

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in the database
    await authenticationDao.createUser({
      email,
      firstName,
      middleName,
      lastName,
      password: hashedPassword,
      otp,
    });

    // Send OTP to user via email
    await sendOTP(email, otp);

    return { message: `OTP sent successfully to ${email}. Waiting for verification.` };
  } catch (error) {
    console.error("Error!", errPor);
    throw new Error("Error in Process");
  }
}


async function registerUserSecondStep(data) {
  const { email, otp } = data;

  try {
    // Retrieve user from database using email
    const user = await authenticationDao.findUserByEmail(email);

    // Check if user exists and if OTP matches
    if (!user || user.otp !== parseInt(otp)) {
      throw new Error("Invalid OTP");
    }

    // If OTP is correct, proceed with user registration
    await authenticationDao.updateUserOTP(email, otp); // Clear OTP from database

    // Proceed with user registration (implementation not shown here)

    return {
      message: "User registered successfully",
      data: user
    };
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}


async function loginWithOTP(otp, ipAddress) {
  try {
    const user = await authenticationDao.findUserByOTP(otp);

    if (!user) {
      const message = "Failed Login";

      await authenticationDao.logUserLogin(ipAddress, null, false, message);

      return { message: message, }
    }

    const token = generateJWTToken(user);
    const message = "User Logged in Successfully";

    await authenticationDao.updateUserToken(user.email, token);

    await authenticationDao.logUserLogin(ipAddress, user.email, true, message, token);

    return {
      message: message,
      token: token,
      data: user
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error in Process");
  }
};


async function login(email, password) {
  try {
    const user = await authenticationDao.findUserByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error("Invalid email or password");
    }
    return { message: "User logged in successfully", data: user };
  } catch (error) {
    console.error("Error!", error);
    throw new Error("Error in Process");
  }
}

async function logoutUser(email, ipAddress) {
  try {
    await authenticationDao.updateUserToken(email, null);

    await authenticationDao.logUserLogout(ipAddress, email);

    return {
      message: "User logged out successfully",
      email: email,
      ipAddress: ipAddress
    };
  } catch (error) {
    console.error("Error logging out user:", error);
    throw new Error("Error logging out user");
  }
}


module.exports = {
  generateJWTToken,
  getAll,
  login,
  logoutUser,
  loginWithOTP,
  generateOTP,
  verifyOTP,
  sendOTP,
  registerUserFirstStep,
  registerUserSecondStep,
};
