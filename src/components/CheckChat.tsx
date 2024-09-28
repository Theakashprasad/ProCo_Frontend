import {
  getChatMessages,
  getChatorCreateChat,
  markAsRead,
  saveImage,
  saveMessage,
  uploadImage,
} from "@/services/chatApi";
import { CheckChatProps, Message } from "@/Types/chat";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { useSocketStore } from "@/store/socketStore";
import { MdVideoCall } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";

const CheckChat: React.FC<CheckChatProps> = ({
  currentUserId,
  otherUserId,
  otherUserDetails,
  onNewMessage,
  onMessagesRead,
}) => {
  const { socket, initializeSocket, handleCall, emitChatMessage, ongoingCall } =
    useSocketStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [userData, setUserData] = useState(initialUserState);
  useEffect(() => {
    if (!socket) {
      console.log("initializing in component");
      initializeSocket();
    }
    if (socket) {
      console.log("socket is presnet", socket);
    }
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chat = await getChatorCreateChat(currentUserId, otherUserId);

        if (chat && chat._id) {
          setChatId(chat._id);
          const messageData = await getChatMessages(chat._id);
          if (Array.isArray(messageData)) {
            setMessages(messageData);

            setTimeout(scrollToBottom, 0);
          } else {
            setMessages([]);
          }
        } else {
          console.error("Chat Id not found");
        }
        console.log(messages, "messages");
      } catch (error) {
        console.error("Error fetching chat or messages:", error);
        setMessages([]);
      }
    };

    fetchChat();
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    if (!socket) {
      initializeSocket();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      const handleChatMessage = (message: Message) => {
        if (message.senderId === otherUserId) {
          setMessages((prevMessages) => [...prevMessages, message]);

          onNewMessage(message.senderId, {
            _id: message._id,
            messageText: message.messageText,
            image: message.image as string,
            createdAt: message.createdAt,
            senderId: message.senderId,
            senderName: otherUserDetails?.fullname,
          });
        }
      };

      socket.on("chat message", handleChatMessage);

      return () => {
        socket.off("chat message", handleChatMessage);
      };
    }
  }, [socket, onNewMessage]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (socket && chatId) {
      try {
        let savedMessage;

        if (inputMessage.trim()) {
          const messageData = {
            chatId,
            senderId: currentUserId,
            receiverId: otherUserId,
            messageText: inputMessage.trim(),
            createdAt: Date.now(),
          };
          savedMessage = await saveMessage(
            chatId,
            currentUserId,
            inputMessage.trim()
          );
          emitChatMessage(messageData);
        } else {
          return;
        }

        setMessages((prevMessages) =>
          prevMessages.some((msg) => msg._id === savedMessage?._id)
            ? prevMessages
            : [...prevMessages, savedMessage]
        );

        onNewMessage(otherUserId, {
          _id: savedMessage._id,
          messageText: savedMessage.messageText,
          image: savedMessage.image as string,
          createdAt: savedMessage.createdAt,
          senderId: savedMessage.senderId,
          senderName: "Me",
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

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const scrollHeight = chatContainerRef.current.scrollHeight;
      const height = chatContainerRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatContainerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full relativ">
      <div className="bg-[#1b1b1b] flex justify-between text-white border-transparent rounded-2xl px-6 py-4">
        <div className="flex uppercase">
          <p>{otherUserDetails?.fullname}</p>
        </div>
        <div className="items-center ">
          {userData.role == "profesional" && (
            <MdVideoCall
              onClick={() => handleCall(otherUserDetails)}
              className="text-4xl"
            />
          )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-grow overflow-auto mb-4 overflow-y-scroll no-scrollbar"
      >
        {messages.length ? (
          messages.map((message: Message, index) => (
            <div
              key={message._id || index}
              className={`flex mb-4 ${
                message.senderId === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div>
                {message.messageText && (
                  <div
                    className={`max-w-xs px-4 py-2 rounded-xl ${
                      message.senderId === currentUserId
                        ? "bg-purple-400 text-black"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {message.messageText}
                  </div>
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
            <FaRegSmile />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={`w-full p-3 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white `}
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-400 text-black rounded-full hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-white"
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
    </div>
  );
};

export default CheckChat;
