const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, branch, cgpa, skills } = req.body;

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            name,
            email,
            password: hashedPassword,
            branch,
            cgpa,
            skills
        });

        await student.save();

        res.status(201).json({ message: "Student registered successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        res.status(200).json({
            message: "Student login successful",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                branch: student.branch,
                cgpa: student.cgpa,
                skills: student.skills
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;