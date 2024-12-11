//we create authentication routes for healthcare providers, 
//allowing them to register and log in. Successful login returns a JWT token, enabling secure access to protected API endpoints.


const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Provider = require('../models/Provider');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const provider = new Provider({ username, email, password });
        await provider.save();
        console.log({ username, email, password })
        res.status(201).json({ msg: 'Provider registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('password', {username, password})
    try {
        const provider = await Provider.findOne({ username });
        if (!provider || !(await provider.isValidPassword(password))) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign({ provider: provider._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
