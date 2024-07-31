const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  columns: [
    {
      id: Number,
      cards: [
        {
          title: String,
          details: String,
          priority: String,
          deadline: Date,
          createdAt: Number,
        },
      ],
    },
  ],
});

const Task = mongoose.model("task", TaskSchema);

module.exports = { Task };
