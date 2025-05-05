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
// middleware to connect with frontend
app.use(cors({
    origin: ["https://crm-sales-self.vercel.app", "https://solar-simulator-eta.vercel.app", "http://localhost:5173"],
    credentials: true,
}));

// middleware to load routes
app.use('/', router);

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app;









// const router = require("./Routes/index");
// const express = require("express");
// const cors = require("cors");

// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");


// const app = express();
// const PORT = process.env.API_PORT || 5000;

// require("dotenv").config();

// // Load environment variables from .env file
// dotenv.config();
// const uri = process.env.MONGODB_URI;
// mongoose
//   .connect(uri)
//   .then(() => console.log("Connected to database"))
//   .catch((error) => console.log("Error connecting to database: ", error));

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); // Required for Twilio webhook
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: [
//       "https://crm-sales-self.vercel.app",
//       "https://solar-simulator-aczlyj2rd-zaim-0c7db352.vercel.app",
//       "http://localhost:5176",
//     ],
//     credentials: true,
//   })
// );

// const twilio = require("twilio");

// const twilioClient = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );


// // Start Call Endpoint
// app.post("/start-call", async (req, res) => {
//   try {
//     const formattedNumber = req.body.to;
//     console.log("Formatted Number:", formattedNumber);

//     const call = await twilioClient.calls.create({
//       // url: `${process.env.SERVER_URL}/outbound-call`,
//        url: `https://${request.headers.host}/outbound-call-twiml?prompt=${encodeURIComponent(prompt)}`,
//       to: formattedNumber,
//       from: process.env.TWILIO_PHONE_NUMBER,
//     });

//     res.json({ success: true, callSid: call.sid });
//   } catch (error) {
//     console.error("Call Error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// // Load routes
// app.use("/", router);

// // Start server

// app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

// module.exports = app;
