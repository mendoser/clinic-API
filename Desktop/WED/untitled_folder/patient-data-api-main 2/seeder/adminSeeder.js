require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db'); // Import the database connection
const Provider = require('../models/Provider'); // Import the Provider model
const readline = require('readline');

// Set up readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt for input
const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
};

// Function to seed provider data
const seedProvider = async () => {
    try {
        await connectDB(); // Connect to MongoDB

        const username = await askQuestion("Enter username: ");
        const email = await askQuestion("Enter email: ");
        const password = await askQuestion("Enter password: ");
        
        // Hash the password
       // const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new provider
        const provider = new Provider({ username, email, password });
        
        await provider.save();
        console.log('Provider data seeded successfully:', { username, email });

    } catch (err) {
        console.error('Error seeding provider data:', err.message);
    } finally {
        rl.close(); // Close readline interface
        process.exit(0); // Exit the process
    }
};

// Initial prompt to confirm creation
const startScript = async () => {
    const response = await askQuestion("Do you want to create a provider data? (Enter yes/y to proceed): ");
    if (response.toLowerCase() === "yes" || response.toLowerCase() === "y") {
        await seedProvider();
    } else {
        console.log("Provider data creation cancelled.");
        rl.close(); // Close readline interface
        process.exit(0); // Exit the process
    }
};

// Run the initial prompt
startScript();