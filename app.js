const express = require("express");
const { PrismaClient } = require("@prisma/client");
const Routes = require("./src/middlewares/routeConfig");
const clear = require("clear");
const https = require("https"); // Import the 'https' module
const fs = require("fs"); // Import the File System module
require("dotenv").config();

const app = express();
const cors = require("cors");
const corsOptions = require("./src/middlewares/corsConfig/corsOptions");
const credentials = require("./src/middlewares/corsConfig/credentials");
const prisma = new PrismaClient();
const port = process.env.PORT || 3000;

app.use(express.json());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

Routes(app, prisma);

const options = {
    key: fs.readFileSync('certificates/key.pem'),
    cert: fs.readFileSync('certificates/cert.pem')
}


const server = https.createServer(options, app);

server.listen(port, () => {
    clear(); // Clear the terminal when the server starts
    console.log(`Server running on port ${port} and SSL added`);
});

module.exports = { prisma };
