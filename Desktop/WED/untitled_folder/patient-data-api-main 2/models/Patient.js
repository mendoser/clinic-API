const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    clinicalData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalData' }]
});

module.exports = mongoose.model('Patient', patientSchema);
