//we set up secure patient routes using JWT authentication. 
//This allows only authenticated healthcare providers to add/view patient info and tests, protecting patient data with restricted access.
const express = require('express');
const Patient = require('../models/Patient');
const ClinicalData = require('../models/ClinicalData')
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


// Add Patient Info
router.post('/', authMiddleware, async (req, res) => {
    const { name, age, gender } = req.body;
    try {
        const patient = new Patient({ name, age, gender });
        await patient.save();
        res.status(201).json(patient);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Patients with Critical Data Flag
router.get('/', authMiddleware, async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate('clinicalData');

        // Add a flag for critical data
        const patientsWithCriticalFlag = await Promise.all(
            patients.map(async (patient) => {
                const hasCriticalData = patient.clinicalData.some((record) => {
                    return (
                        (record.type === 'Blood Pressure' && (record.reading < '90/60 mmHg' || record.reading > '150/90 mmHg')) ||
                        (record.type === 'Blood Oxygen Level' && record.reading < '90%') ||
                        (record.type === 'Heart Beat Rate' && record.reading > '100/min') ||
                        (record.type === 'Respiratory Rate' && record.reading > '25/min')
                    );
                });

                return {
                    ...patient.toObject(),
                    hasCriticalData,
                };
            })
        );

        res.json(patientsWithCriticalFlag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/patients/critical
router.get('/critical', authMiddleware, async (req, res) => {
    try {
        const criticalPatients = await ClinicalData.find({
            $or: [
                { type: 'Blood Pressure', reading: { $lt: '90/60 mmHg' } },
                { type: 'Blood Pressure', reading: { $gt: '150/90 mmHg' } },
                { type: 'Blood Oxygen Level', reading: { $lt: '90%' } },
                { type: 'Heart Beat Rate', reading: { $gt: '100/min' } },
                { type: 'Respiratory Rate', reading: { $gt: '25/min' } }
            ]
        }).populate('patientId');

        // Group data by patient for better readability
        const groupedByPatient = criticalPatients.reduce((acc, record) => {
            const patientId = record.patientId._id.toString();
            if (!acc[patientId]) {
                acc[patientId] = { patient: record.patientId, records: [] };
            }
            acc[patientId].records.push(record);
            return acc;
        }, {});

        res.json(Object.values(groupedByPatient));
    } catch (err) {
        console.error('Error fetching critical patients:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// View Patient Info
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('clinicalData'); // Populate clinical data instead of just ID references
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });
        res.json(patient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/patients/:patientId/clinical-data
router.post('/:patientId/clinical-data', authMiddleware, async (req, res) => {
    const { patientId } = req.params;
    const { type, reading } = req.body;

    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        // Create a new clinical data entry with validation
        const newClinicalData = new ClinicalData({
            patientId: patientId,
            type: type,
            reading: reading
        });

        // Validate and save the clinical data
        await newClinicalData.validate(); // Validate first to catch any format errors

        await newClinicalData.save();

        // Associate the clinical data with the patient
        patient.clinicalData.push(newClinicalData._id);
        await patient.save();

        res.status(201).json(newClinicalData);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        console.error('Error saving clinical data:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE /api/patients/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const patient = await Patient.findById(id);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        // Delete all clinical data associated with the patient
        await ClinicalData.deleteMany({ patientId: id });

        // Delete the patient
        await patient.deleteOne();

        res.status(200).json({ msg: 'Patient and associated clinical data deleted successfully' });
    } catch (err) {
        console.error('Error deleting patient:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
