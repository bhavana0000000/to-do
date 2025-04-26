const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// Add task
router.post('/', auth, async (req, res) => {
  const task = await Task.create({ userId: req.userId, text: req.body.text, completed: false });
  res.status(201).json(task);
});

// Update task
router.patch('/:id', auth, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { completed: req.body.completed },
    { new: true }
  );
  res.json(task);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Deleted' });
});

module.exports = router;
