// src/routes/user.js

const express = require("express");
const router = express.Router();
const Users = require("../models/users.model");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const user = await Users.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to create user." });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await Users.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ message: "Users not found." });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user." });
  }
});

// Update user by ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedRowsCount] = await Users.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedRowsCount === 0) {
      res.status(404).json({ message: "Users not found." });
    } else {
      const user = await Users.findByPk(req.params.id);
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update user." });
  }
});

// Delete user by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedRowsCount = await Users.destroy({ where: { id: req.params.id } });
    if (deletedRowsCount === 0) {
      res.status(404).json({ message: "Users not found." });
    } else {
      res.json({ message: "Users deleted successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user." });
  }
});

module.exports = router;
