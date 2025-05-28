"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  username: string;
};

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
};

export default function ChatPage() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setCurrentUserId(payload.userId);
    } catch (err) {
      console.error("Invalid token");
    }
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const users: User[] = await res.json();
        setContacts(users);
        if (users.length > 0) setActiveContact(users[0]);
      } catch (error) {
        console.error("Error fetching users:", error);
        setContacts([]);
      }
      setLoadingContacts(false);
    }
    loadUsers();
  }, []);

  useEffect(() => {
    async function fetchMessages() {
      if (!activeContact || !currentUserId) return;

      const token = localStorage.getItem("token");
      const conversationId = [currentUserId, activeContact._id].sort().join("_");

      try {
        const res = await fetch(`http://localhost:5000/api/messages/${conversationId}?limit=30`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data: Message[] = await res.json();
        setMessages(data);

        // Auto-mark as read (optional backend endpoint)
        await fetch(`http://localhost:5000/api/messages/${conversationId}/read`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    }

    fetchMessages();
  }, [activeContact, currentUserId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function handleSendMessage() {
    if (!activeContact || message.trim() === "") return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/messages/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: activeContact._id,
          text: message,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to send message");

      setMessages((prev) => [...prev, result.data]);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function formatDateGroup(dateString: string): string {
    const date = new Date(dateString);
    return date.toDateString();
  }

  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDateGroup(msg.createdAt);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-lilac-200 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-purple-200 shadow-md rounded-b-xl">
        <h1 className="text-2xl font-caveat-bold text-purple-800"> 💎 UnityApp</h1>
        <div className="flex gap-2">
          <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl shadow-md transition">
            + Add New Contact
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-xl shadow-md transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-purple-100 border-r border-purple-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Contacts</h2>
          {loadingContacts ? (
            <p className="text-purple-700">Loading contacts...</p>
          ) : (
            <ul className="space-y-2">
              {contacts.map((contact) => (
                <li
                  key={contact._id}
                  className={`p-3 rounded-xl cursor-pointer transition ${
                    activeContact?._id === contact._id
                      ? "bg-purple-300 text-white"
                      : "hover:bg-purple-200 text-purple-700"
                  }`}
                  onClick={() => setActiveContact(contact)}
                >
                  {contact.username}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 p-6 flex flex-col">
          <div className="flex-1 bg-white rounded-2xl shadow-inner p-4 overflow-y-auto mb-4 flex flex-col space-y-3">
            {activeContact ? (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date} className="space-y-2">
                  <div className="text-center text-purple-500 font-medium my-2">{date}</div>
                  {msgs.map((msg) => (
                    <div
                      key={msg._id}
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow text-white relative ${
                        msg.senderId === currentUserId
                          ? "bg-purple-400 self-end ml-auto text-right"
                          : "bg-pink-300 self-start mr-auto text-left"
                      }`}
                    >
                      {msg.text}
                      <div className="text-xs text-gray-200 mt-1">
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-purple-700">Select a contact to start chatting.</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4 py-2 bg-white text-black border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!activeContact}
            />
            <button
              className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-2 rounded-full shadow-md transition"
              disabled={!activeContact || message.trim() === ""}
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
