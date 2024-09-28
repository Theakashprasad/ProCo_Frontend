"use client";
import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Picker, { EmojiClickData } from "emoji-picker-react";
import {
  getChatMessages,
  getChatorCreateChat,
  markAsRead,
  saveImage,
  saveMessage,
  uploadImage,
} from "@/services/chatApi";

const BACKEND_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface LastMessage {
  _id: string;
  messageText: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  image: string;
}

interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  messageText: string;
  image?: string;
  createdAt: string;
}

interface ChatProps {
  currentUserId: string;
  otherUserId: string;
  onNewMessage: (chatId: string, newMessage: LastMessage) => void;
}

const Chat: React.FC<ChatProps> = ({
  currentUserId,
  otherUserId,
  onNewMessage,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    console.log("socket conection");
    const newSocket = io(`${BACKEND_URL}`);
    console.log("socket connectng", newSocket);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    
      if (socket) {
        socket.emit("join chat", {
          chatId,
        });

      socket.off("chat message").on("chat message", (message: Message) => {
        setMessages((prevMessages) => {
          if (!prevMessages.some((m) => m._id === message._id)) {
            onNewMessage(message.chatId, {
              _id: message._id,
              messageText: message.messageText,
              image: message.image as string,
              createdAt: message.createdAt,
              senderId: message.senderId,
              senderName: "Other User",
            });
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      });
      console.log("object");
      const fetchChat = async () => {
        console.log("fetching chat");
        try {
          const chat = await getChatorCreateChat(currentUserId, otherUserId);
          console.log(chat,'chat')
          if (chat && chat._id) {
            setChatId(chat._id);
            console.log('fiind messages')
            const messageData = await getChatMessages(chat._id);
            console.log(messageData,'mesg')
            if (Array.isArray(messageData)) {
              setMessages(messageData);
              console.log(messages,'messages')
              // await markAsRead(chat._id, otherUserId);
            } else {
              setMessages([]);
            }
          } else {
            console.error("Chat ID not found");
          }
        } catch (error) {
          console.error("Error fetching chat or messages:", error);
          setMessages([]);
        }
      };

      fetchChat();
    }

    return () => {
      socket?.off("chat message");
    };
  }, [socket, currentUserId, otherUserId, onNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("send", socket, chatId);
    if (socket && chatId) {
      console.log("socket und", socket, chatId);
      try {
        let savedMessage;
        if (selectedImage) {
          const formData = new FormData();
          formData.append("file", selectedImage);
          const imageUrl = await uploadImage(chatId, currentUserId, formData);
          savedMessage = await saveImage(chatId, currentUserId, imageUrl);
          setSelectedImage(null);
          setImagePreview(null);
        } else if (inputMessage.trim()) {
          console.log("msg text");
          const messageData = {
            chatId,
            senderId: currentUserId,
            messageText: inputMessage.trim(),
          };
          socket.emit("chat message", messageData);
          savedMessage = await saveMessage(
            chatId,
            currentUserId,
            inputMessage.trim()
          );
        } else {
          return;
        }

        setMessages((prevMessages) => [...prevMessages, savedMessage]);

        onNewMessage(chatId, {
          _id: savedMessage._id,
          messageText: savedMessage.messageText || "",
          image: savedMessage.image || "",
          createdAt: savedMessage.createdAt,
          senderId: savedMessage.senderId,
          senderName: selectedImage ? "You" : "Other User",
        });

        setInputMessage("");
      } catch (error) {
        console.error("Error saving message:", error);
      }
    }
  };

  const addEmoji = (emojiData: EmojiClickData) => {
    setInputMessage((prevMessage) => prevMessage + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShowFullScreen = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };
  const handleCloseFullScreen = () => {
    setFullScreenImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto mb-4 overflow-y-scroll no-scrollbar">
        {messages.length ? (
          messages.map((message: Message) => (
            <div
              key={message._id}
              className={`flex mb-4 ${
                message.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div>
                {message.messageText ? (
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? "bg-purple-400 text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {message.messageText}
                  </div>
                ) : null}

                {message.image && (
                  <img
                    src={message.image}
                    alt="Message"
                    className="mt-2 max-w-xs h-20 w-auto object-fill cursor-pointer"
                    onClick={() =>
                      handleShowFullScreen(message.image as string)
                    }
                  />
                )}

                <span className="text-xs text-gray-400 block mt-1 text-right">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="flex justify-center text-center text-gray-400">
            Start a conversation.
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="mt-4 relative">
        <div className="flex space-x-2 items-center">
          <button
            type="button"
            className="text-xl"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            😊
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
          {/* <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-6 align-middle bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            📷
          </button> */}

          {/* {imagePreview && (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-32 object-cover"
              />
              <button
                type="button"
                className="absolute top-0 right-0 text-red-500"
                onClick={() => {
                  setImagePreview(null);
                  setSelectedImage(null);
                }}
              >
                ❌
              </button>
            </div>
          )} */}

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={`w-full p-3 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              imagePreview ? "hidden" : ""
            }`}
            placeholder="Type something..." 
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-400 text-black rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Send
          </button>
        </div>
      </form>

      {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "100px", zIndex: 1000 }}>
          <Picker onEmojiClick={addEmoji} />
        </div>
      )}

      {fullScreenImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50 p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={fullScreenImage}
              alt="Full screen image"
              className="max-h-[calc(100vh-2rem)] max-w-[calc(100vw-2rem)] object-contain"
            />
            <button
              onClick={handleCloseFullScreen}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
