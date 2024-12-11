//entry point of the API server,it can be named server.js or main.js is also use to import all the route 
require('dotenv').config();  // This loads the environment variables from the .env file
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
require('dotenv').config();

const app = express();
connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
