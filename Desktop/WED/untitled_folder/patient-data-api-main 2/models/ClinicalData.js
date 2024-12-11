const mongoose = require('mongoose');

const clinicalDataSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    type: { 
        type: String, 
        enum: ['Blood Pressure', 'Respiratory Rate', 'Blood Oxygen Level', 'Heart Beat Rate'], 
        required: true 
    },
    reading: { 
        type: String, 
        required: true,
        validate: {
            validator: function(value) {
                // Regex patterns for different data types
                const patterns = {
                    'Blood Pressure': /^\d{2,3}\/\d{2,3} mmHg$/, // Matches "X/Y mmHg" where X and Y are integers
                    'Respiratory Rate': /^\d{1,3}\/min$/, // Matches "X/min" where X is an integer
                    'Blood Oxygen Level': /^\d{1,3}%$/, // Matches "X%" where X is an integer
                    'Heart Beat Rate': /^\d{1,3}\/min$/ // Matches "X/min" where X is an integer
                };
                return patterns[this.type] ? patterns[this.type].test(value) : false;
            },
            message: props => `${props.value} is not a valid reading for type ${props.path}`
        }
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClinicalData', clinicalDataSchema);
