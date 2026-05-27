const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    package: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: String
    },
    lastDate: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Job", jobSchema);