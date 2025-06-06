const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/auth");

// POST /api/messages
router.post('/', auth, async (req, res) => {
  try {
    const senderId = req.user.userId; 
    const { receiverId, text } = req.body;

    if (!receiverId || !text?.trim()) {
      return res.status(400).json({ error: 'Receiver ID and message text are required.' });
    }

    const conversationId = [senderId, receiverId].sort().join('_');

    const message = new Message({
      senderId,
      receiverId,
      text: text.trim(),
      read: false,
      timestamp: Date.now(),
      conversationId,
    });

    await message.save();

    res.status(201).json({ message: 'Message sent', data: message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
});

// Get all messages by conversationId
router.get("/:conversationId", auth, async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
