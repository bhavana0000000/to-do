const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  completed: Boolean
});
module.exports = mongoose.model('Task', TaskSchema);
