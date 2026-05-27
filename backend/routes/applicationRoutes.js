const express = require("express");
const Application = require("../models/application");

const router = express.Router();

router.post("/apply", async (req, res) => {
    try {
        const { studentId, jobId } = req.body;

        const application = new Application({
            studentId,
            jobId
        });

        await application.save();

        res.status(201).json({
            message: "Job applied successfully",
            application
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("studentId")
            .populate("jobId");

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/update-status/:id", async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            message: "Application status updated successfully",
            application
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;