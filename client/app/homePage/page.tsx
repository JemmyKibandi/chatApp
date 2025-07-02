"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiSettings, FiUser, FiLock, FiLogOut } from "react-icons/fi";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Decode token to get current user ID on mount
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

  // Load users and set first active contact
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

  // Fetch messages for active contact and current user
  useEffect(() => {
    async function fetchMessages() {
      if (!activeContact || !currentUserId) return;

      const token = localStorage.getItem("token");
      const conversationId = [currentUserId, activeContact._id]
        .sort()
        .join("_");

      try {
        const res = await fetch(
          `http://localhost:5000/api/messages/${conversationId}?limit=30`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch messages");

        const data: Message[] = await res.json();
        setMessages(data);

        // Optionally mark messages as read
        await fetch(
          `http://localhost:5000/api/messages/${conversationId}/read`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    }

    fetchMessages();
  }, [activeContact, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Filter contacts based on search text
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Get last message timestamp for a contact
  function getLastMessageTime(contactId: string) {
    if (!currentUserId) return null;

    const relevantMessages = messages.filter(
      (msg) =>
        (msg.senderId === currentUserId && msg.receiverId === contactId) ||
        (msg.senderId === contactId && msg.receiverId === currentUserId)
    );

    if (relevantMessages.length === 0) return null;

    relevantMessages.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return relevantMessages[0].createdAt;
  }

  // Add lastMessageTime to filtered contacts
  const contactsWithLastMessage = filteredContacts.map((contact) => ({
    ...contact,
    lastMessageTime: getLastMessageTime(contact._id),
  }));

  // Format date groups for message display
  function formatDateGroup(dateString: string): string {
    const date = new Date(dateString);
    return date.toDateString();
  }

  // Format time display for messages
  function formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // Format last message time like "5m ago", "Just now"
  function formatTimeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  }

  // Group messages by date string
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDateGroup(msg.createdAt);
    acc[dateKey] = acc[dateKey] || [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  // Toggle sidebar open/close and reset showOptions accordingly
  const toggleSidebar = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
      setShowOptions(false);
    } else {
      setSidebarOpen(true);
      setShowOptions(true); // show options on open as per your earlier toggle logic
    }
  };

  // Handle logout
  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  // Handle sending message
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

      if (!response.ok)
        throw new Error(result.error || "Failed to send message");

      setMessages((prev) => [...prev, result.data]);
      setMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-lilac-200 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-purple-200 shadow-md rounded-b-xl">
        <h1 className="text-2xl font-caveat-bold text-purple-800">
          💎 UnityApp
        </h1>
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
        {/* Sidebar toggle button */}
        <div className="p-2">
          <button onClick={toggleSidebar} className="text-purple-700">
            <FiMenu size={36} />
          </button>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-purple-800 border-r border-purple-300 p-4 overflow-y-auto h-screen">
            {showOptions ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 text-white hover:text-purple-900"
                >
                  <FiUser /> Contacts
                </button>
                <button className="flex items-center gap-2 text-white hover:text-purple-900">
                  <FiSettings /> Settings
                </button>
                <button className="flex items-center gap-2 text-white hover:text-purple-900">
                  <FiLock /> Privacy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white hover:text-purple-900"
                >
                  <FiLogOut /> Logout
                </button>
              </div>
            ) : (
              <div>
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search contacts..."
                  className="w-full p-2 mb-4 rounded-md border border-purple-300"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Contacts Header */}
                <h2 className="text-lg font-semibold text-white mb-4">
                  Contacts
                </h2>

                {/* Contacts List */}
                {loadingContacts ? (
                  <p className="text-white">Loading contacts...</p>
                ) : contactsWithLastMessage.length === 0 ? (
                  <p className="text-white">No contacts found</p>
                ) : (
                  <ul className="space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto">
                    {contactsWithLastMessage.map((contact) => (
                      <li
                        key={contact._id}
                        onClick={() => {
                          setActiveContact(contact);
                          setSidebarOpen(true);
                          setShowOptions(true);
                          setSearch("");
                        }}
                        className={`p-3 rounded cursor-pointer transition ${
                          activeContact?._id === contact._id
                            ? "bg-purple-300 text-white"
                            : "hover:bg-purple-200 text-white"
                        } flex justify-between items-center`}
                      >
                        <span>{contact.username}</span>
                        {contact.lastMessageTime && (
                          <span className="text-sm text-purple-500">
                            {formatTimeAgo(contact.lastMessageTime)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </aside>
        )}

        {/* Chat window */}
        <main className="flex-1 h-screen p-6 flex flex-col">
          <div className="flex-grow overflow-y-auto mb-6 space-y-6">
            {Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="sticky top-0 bg-purple-200 rounded-xl p-2 text-center font-semibold text-purple-700 mb-4">
                  {date}
                </div>

                {msgs.map((msg) => {
                  const isSender = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg._id}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[60%] px-4 py-2 rounded-2xl relative text-purple-900 ${
                          isSender
                            ? "bg-purple-300 rounded-br-none"
                            : "bg-white rounded-bl-none"
                        }`}
                      >
                        <div>{msg.text}</div>
                        <div className="text-xs text-purple-500 text-right mt-1">
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <textarea
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4 py-2 bg-white text-black border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={!activeContact}
              rows={1}
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
