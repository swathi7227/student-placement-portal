const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

router.post("/add", async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();

        res.status(201).json({
            message: "Job added successfully",
            job
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;