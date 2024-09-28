"use client";
import React, { useEffect, useState } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import axios from "axios";
import { AiTwotoneDelete } from "react-icons/ai";
import { toast } from "sonner";
import { IoSend } from "react-icons/io5";

const MODEL_NAME = "gemini-pro";
const API_KEY = "AIzaSyBmytuwmL7JE4-PVoRkxNPSENYDwcnX2NY";
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);

  useEffect(() => {
    const fetchData = async () => {
      const data = await axios.get(`${BASE_URL}/api/ShowChatAi/${user?._id}`, {
        withCredentials: true,
      });
      if (data.data.userData) {
        setChatHistory(data.data.userData.chatHistory);
      }
    };
    fetchData();
  }, []);

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
              text: "You are PROCO_AI, an AI assistant created by proCo to help users learn about any education content they want to know. Your primary task is to capture the user's name before proceeding further. Do not answer any questions until the user has provided their name. Once you have their name, thank them and address them personally as you continue the conversation.",
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
      const updatedChatHistory: ChatMessage[] = [
        ...chatHistory,
        { role: "user", text: userInput }, // "user" is explicitly typed
        { role: "model", text: response.text() }, // "model" is explicitly typed
      ];

      setChatHistory(updatedChatHistory);

      // setChatHistory((prevHistory) => [
      //   ...prevHistory,
      //   { role: "user", text: userInput },
      //   { role: "model", text: response.text() },
      // ]);
      setUserInput("");
      console.log(BASE_URL, updatedChatHistory);

      const data = await axios.post(
        `${BASE_URL}/api/ChatAi`,
        { email: user?.email, userId: user?._id, updatedChatHistory },
        { withCredentials: true }
      );
      console.log(data);
    } catch (error) {
      console.error("Error in chat:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          role: "model",
          text: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async () => {
    const data = await axios.post(
      `${BASE_URL}/api/ChatAiDelete`,
      { email: user?.email, userId: user?._id },
      { withCredentials: true }
    );
    setChatHistory([])
    toast.success("Successfully deleted", {
      position: "top-center",
    });
  };
  return (
    <div className="flex flex-col items-center min-h-screen bg-[#1d1d1d]">
      <div className="w-full rounded-lg overflow-hidden">
        <h1 className="uppercase text-xl font-bold text-white text-left p-4 bg-[#1d1d1d] border-b-2 border-purple-600">
          ProCo.ai
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
      <div className="flex p-4 w-1/2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-8 py-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={runChat}
          disabled={isLoading}
          className="ml-2 px-6 py-2 bg-stone-700 text-white font-semibold rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-300 ease-in-out"
        >
          {isLoading ? "Sending..." : <IoSend /> }
        </button>
        <div className="pl-7 pt-4">
          <AiTwotoneDelete className="w-5 h-5" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
