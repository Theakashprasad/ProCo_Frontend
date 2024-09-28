"use client";
import React from "react";

import { useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-pro";
// const API_KEY = process.env.VITE_API_KEY
const API_KEY = "AIzaSyBmytuwmL7JE4-PVoRkxNPSENYDwcnX2NY";

const AiChat = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const runChat = async () => {
    setIsLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 1000,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      // ... other safety settings
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are Akash, an AI assistant created by AK_youngster to help users learn about anything they want to know. Your primary task is to capture the user's name before proceeding further. Do not answer any questions until the user has provided their name. Once you have their name, thank them and address them personally as you continue the conversation.",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Hello! Welcome to AK_ai. My name is AK. What's your name?",
            },
          ],
        },
      ],
    });

    try {
      const result = await chat.sendMessage(userInput);
      const response = result.response;
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "user", text: userInput },
        { role: "model", text: response.text() },
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Error in chat:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: "model", text: `Error: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex  flex-col items-center min-h-screen bg-[#1d1d1d] ">
      <div className="w-full  rounded-lg overflow-hidden">
        <h1 className="text-xl font-bold text-white text-left p-4 bg-[#1d1d1d]  border-b-2 border-blue-600">
          Chat with ProCo.ai
        </h1>
        <div className="h-[40rem] overflow-y-auto p-4 px-56 space-y-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[50%] ${
                message.role === "user"
                  ? "bg-[#292929] ml-auto rounded-br-none text-right"
                  : "mr-auto rounded-bl-none"
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="flex p-4">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={runChat}
          disabled={isLoading}
          className="ml-2 px-6 py-2 bg-blue-500 text-white font-semibold rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AiChat;
