const express = require("express");
//const schoolsRouter = require("../Schools/schools-controller");
const authRouter = require("../Controllers/authentication-controller");


const Routes = (app, prisma) => {
    const router = express.Router();

    //router.use("/school", schoolsRouter);
    
    app.use("/user", authRouter)
    app.use("/", router);


    router.use((req, res) => {
        res.status(404).send('Route not found');
      });


    router.use((req, res) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong! ");
    });
};

module.exports = Routes;