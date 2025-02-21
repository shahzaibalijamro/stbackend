const express = require("express");
const router = express.Router();
const CostMaterial = require("../models/materialModel");

// Get all materials
router.get("/", async (req, res) => {
    try {
        const data = await CostMaterial.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching materials" });
    }
});

// Create a new material entry
router.post("/", async (req, res) => {
    try {
        const newEntry = new CostMaterial(req.body);
        await newEntry.save();
        res.json(newEntry);
    } catch (error) {
        res.status(500).json({ error: "Error creating material" });
    }
});

// Edit/Update a material entry
router.put("/:id", async (req, res) => {
    try {
        const updatedEntry = await CostMaterial.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return updated document
            runValidators: true, // Ensure validation runs on update
        });

        if (!updatedEntry) {
            return res.status(404).json({ error: "Material not found" });
        }

        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ error: "Error updating material" });
    }
});

// Delete a material entry
router.delete("/:id", async (req, res) => {
    try {
        const deletedEntry = await CostMaterial.findByIdAndDelete(req.params.id);
        
        if (!deletedEntry) {
            return res.status(404).json({ error: "Material not found" });
        }

        res.json({ message: "Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting material" });
    }
});

module.exports = router;
