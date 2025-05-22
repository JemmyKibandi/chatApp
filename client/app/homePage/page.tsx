"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For programmatic navigation

type User = {
  _id: string;
  username: string;
};

export default function ChatPage() {
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeContact, setActiveContact] = useState<User | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [message, setMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch("/api/auth");
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

  // 🔐 Logout handler
  function handleLogout() {
    localStorage.removeItem("token"); // Or sessionStorage, depending on what you use
    router.push("/login");
  }

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
          <div className="flex-1 bg-white rounded-2xl shadow-inner p-4 overflow-y-auto mb-4">
            {activeContact ? (
              <p className="text-purple-700">
                Chatting with <strong>{activeContact.username}</strong>...
              </p>
            ) : (
              <p className="text-purple-700">Select a contact to start chatting.</p>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4 py-2 bg-purple-50 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!activeContact}
            />
            <button
              className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-2 rounded-full shadow-md transition"
              disabled={!activeContact || message.trim() === ""}
              onClick={() => {
                console.log("Send message to", activeContact?.username, ":", message);
                setMessage("");
              }}
            >
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
