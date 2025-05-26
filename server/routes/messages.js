const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// POST /api/messages
router.post("/", async (req, res) => {
  const { chatID, sender, content } = req.body;

  if (!chatID || !sender || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newMessage = new Message({
      chatID,
      sender,
      content
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//FETCH /api/id
router.get("/:chatID", async (req, res) => {
  const { chatID } = req.params;

  if (!chatID) {
    return res.status(400).json({ message: "Chat ID is required" });
  }

  try {
    const messages = await Message.find({ chatID }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
