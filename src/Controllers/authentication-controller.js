const express = require("express");
const authRouter = express.Router();
const authenticationService = require("../Services/authentication-service");

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

module.exports = authRouter;
