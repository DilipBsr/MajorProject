const Test = require('../Models/testSchema');  // Import Test Model

// Function to create a new test
const createTest = async (req, res) => {
    try {
        const { userId,user, category, correct_signs, total_signs } = req.body;

        if (!userId || !category || correct_signs === undefined || total_signs === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Calculate score (Example: percentage-based scoring)
        const score = Math.round((correct_signs / total_signs) * 100);

        // Save test to database
        const newTest = new Test({
            userId,
            user,
            category,
            score,
            correct_signs,
            total_signs,
            certificate_url: `/certificates/${userId}.pdf`,  // Example certificate path
        });

        const savedTest = await newTest.save();

        res.status(201).json({
            status: "success",
            testId: savedTest._id,  // Use MongoDB’s _id as test ID
            score: savedTest.score,
            correct_signs: savedTest.correct_signs,
            total_signs: savedTest.total_signs,
            certificate_url: savedTest.certificate_url,
            date: savedTest.date,
        });

    } catch (error) {
        console.error("Error creating test:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { createTest };
