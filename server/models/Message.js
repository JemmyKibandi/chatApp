const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: String, // Alternatively, use `Date` type if you want auto formatting
    default: () => new Date().toISOString()
  }
});

module.exports = mongoose.model("Message", MessageSchema);
