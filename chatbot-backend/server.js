const router = require("./Routes/index");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
require('dotenv').config();
// Connecter à MongoDB
const uri = process.env.MONGODB_URI;

// Connection to the database
mongoose
    .connect(uri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log('Error connecting to database: ', error);
    });

// middleware to parse incoming requests

// middleware to parse cookies
app.use(express.json({ limit: '50mb' })); // Parse JSON bodies
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Pour les données en formulaire
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// middleware to connect with frontend
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}));

// middleware to load routes
app.use('/', router);

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;





