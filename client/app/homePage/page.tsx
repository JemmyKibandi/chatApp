"use client";

import React, { useState } from "react";

const contacts = ["Alice", "Bob", "Charlie"];

export default function ChatPage() {
  const [activeContact, setActiveContact] = useState("Alice");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 via-purple-100 to-lilac-200 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-purple-200 shadow-md rounded-b-xl">
        <h1 className="text-2xl font-caveat-bold text-purple-800"> 💎 UnityApp</h1>
        <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl shadow-md transition">
          + Add New Contact
        </button>
      </nav>

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-purple-100 border-r border-purple-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">Contacts</h2>
          <ul className="space-y-2">
            {contacts.map((contact) => (
              <li
                key={contact}
                className={`p-3 rounded-xl cursor-pointer transition ${
                  contact === activeContact
                    ? "bg-purple-300 text-white"
                    : "hover:bg-purple-200 text-purple-700"
                }`}
                onClick={() => setActiveContact(contact)}
              >
                {contact}
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 p-6 flex flex-col">
          <div className="flex-1 bg-white rounded-2xl shadow-inner p-4 overflow-y-auto mb-4">
            <p className="text-purple-700">Chatting with <strong>{activeContact}</strong>...</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-full px-4 py-2 bg-purple-50 border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button className="bg-purple-400 hover:bg-purple-500 text-white px-6 py-2 rounded-full shadow-md transition">
              Send
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
