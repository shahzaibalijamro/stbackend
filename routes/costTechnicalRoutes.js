const express = require("express");
const CostTechnical = require("../models/technicianModel");

const router = express.Router();

// Get all technicians
router.get("/", async (req, res) => {
    try {
        const data = await CostTechnical.find();
        res.status(200).json(data); // 200 OK
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve data", details: error.message }); // 500 Internal Server Error
    }
});

// Create a new technician entry
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const newEntry = new CostTechnical(req.body);
        await newEntry.save();
        res.status(201).json(newEntry); // 201 Created
    } catch (error) {
        res.status(400).json({ error: "Failed to create entry", details: error.message }); // 400 Bad Request
    }
});

// Edit/Update a technician entry
router.put("/:id", async (req, res) => {
    try {
        const updatedEntry = await CostTechnical.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // Return updated document
                runValidators: true, // Ensure validation runs on update
            }
        );

        if (!updatedEntry) {
            return res.status(404).json({ error: "Entry not found" }); // 404 Not Found
        }

        res.status(200).json(updatedEntry); // 200 OK
    } catch (error) {
        res.status(500).json({ error: "Failed to update entry", details: error.message }); // 500 Internal Server Error
    }
});

// Delete a technician entry
router.delete("/:id", async (req, res) => {
    try {
        const deletedEntry = await CostTechnical.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ error: "Entry not found" }); // 404 Not Found
        }
        res.status(200).json({ message: "Deleted Successfully" }); // 200 OK
    } catch (error) {
        res.status(500).json({ error: "Failed to delete entry", details: error.message }); // 500 Internal Server Error
    }
});

module.exports = router;
