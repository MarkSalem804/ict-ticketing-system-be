const express = require("express");
const authRouter = express.Router();
const authenticationService = require("../Services/authentication-service");

authRouter.get("/getUsers", async (req, res) => {
  try {
    const data = await authenticationService.getAll();

    return res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/registerUserFirstStep", async (req, res) => {
  try {
    const data = req.body;
    const result = await authenticationService.registerUserFirstStep(data);

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/registerUserSecondStep", async (req, res) => {
  try {
    const data = req.body;
    const result = await authenticationService.registerUserSecondStep(data);

    res.status(200).json(result); // Send the result message
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/loginOTP/:otp", async (req, res) => {
  try {
    const otp = parseInt(req.params.otp, 10);
    const ipAddress = req.ip;

    const result = await authenticationService.loginWithOTP(otp, ipAddress);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    const ipAddress = req.ip;
    const result = await authenticationService.logoutUser(email, ipAddress);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

authRouter.delete("/deleteUser/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const result = await authenticationService.deleteUser(userId);
    return result;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = authRouter;
