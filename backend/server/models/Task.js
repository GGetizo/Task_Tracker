const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
