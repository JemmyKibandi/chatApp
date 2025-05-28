const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds `createdAt` and `updatedAt`
  }
);

// Optional: add an index for faster querying by conversation
messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("Message", messageSchema);
