//Bcrypt is often used in applications to securely store user passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const providerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:{ type: String, required: true, unique: true},
    password: { type: String, required: true }
});

providerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
//static function
providerSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Provider', providerSchema);
