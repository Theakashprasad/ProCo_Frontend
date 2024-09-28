"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSocketStore } from "@/store/socketStore";
import { ToastContainer, toast } from "react-toastify";
import { FaSearch, FaUsers } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import { getUserChats } from "@/services/chatApi";
import { fetchUserById } from "@/services/userApi";
import axios from "axios";
import CheckChat from "@/components/CheckChat";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import CallNotification from "@/components/CallNotification";
import Videocall from "@/components/VideoCall";

interface LastMessage {
  _id: string;
  messageText: string;
  createdAt: string;
  senderId: string;
  senderName: string | undefined;
  image: string;
}

export interface User {
  _id: string;
  fullname: string;
  email: string;
}

interface Chat {
  _id: string;
  lastMessage: LastMessage;
  otherUser: User;
  unreadMessages: number;
}

const Page = () => {
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const { userId } = useParams();

  const router = useRouter();
  const currentUserId = user?._id;
  const { socket, initializeSocket, ongoingCall } = useSocketStore();

  const [chatUsers, setChatUsers] = useState<Chat[]>([]);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(
    ""
  );
  const [selectedChatUserDetails, setSelectedChatUserDetails] =
    useState<User>();

  useEffect(() => {
    console.log(currentUserId, "cuu");

    const fetchUserChats = async () => {
      if (currentUserId) {
        try {
          const chats = await getUserChats(currentUserId);
          console.log(chats, "AllChats");

          const sortedChats = chats.sort(
            (a: Chat, b: Chat) =>
              new Date(b.lastMessage.createdAt).getTime() -
              new Date(a.lastMessage.createdAt).getTime()
          );
          console.log(sortedChats, "sortedChats");

          setChatUsers(sortedChats);

          if (sortedChats.length > 0) {
            const selectedChat = sortedChats.find(
              (chat: Chat) => chat.otherUser._id === userId
            );
            if (selectedChat) {
              setSelectedChatUserId(userId as string);
              setSelectedChatUserDetails(selectedChat.otherUser);
            } else if (userId) {
              const token = localStorage.getItem("userAccessToken");
              const newChatUser = await fetchUserById(
                token as string,
                userId as string
              );
              setSelectedChatUserId(userId as string);
              setSelectedChatUserId(newChatUser.nativeUser);
              setChatUsers([
                {
                  _id: "temp",
                  lastMessage: {
                    _id: "",
                    messageText: "",
                    createdAt: new Date().toISOString(),
                    senderId: "",
                    senderName: "",
                    image: "",
                  },
                  otherUser: newChatUser.nativeUser,
                  unreadMessages: 0,
                },
                ...sortedChats,
              ]);
            } else {
              setSelectedChatUserId(sortedChats[0].otherUser._id);
              setSelectedChatUserDetails(sortedChats[0].otherUser);
              router.push(`/chat/${sortedChats[0].otherUser._id}`);
            }
          } else if (userId) {
            const token = localStorage.getItem("userAccessToken");
            const newChatUser = await fetchUserById(
              token as string,
              userId as string
            );
            setSelectedChatUserId(userId as string);
            setSelectedChatUserId(newChatUser.nativeUser);
            setChatUsers([
              {
                _id: "temp",
                lastMessage: {
                  _id: "",
                  messageText: "",
                  createdAt: new Date().toISOString(),
                  senderId: "",
                  senderName: "",
                  image: "",
                },
                otherUser: newChatUser.nativeUser,
                unreadMessages: 0,
              },
              ...sortedChats,
            ]);
          } else {
            setChatUsers([]);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response && error.response.status === 403) {
              toast.error("User is blocked");
            }
          }
          console.error("Error fetching user chats:", error);
        }
      }
    };

    fetchUserChats();
  }, [currentUserId, router, userId]);

  useEffect(() => {
    if (!socket) {
      console.log("initializing in page");
      initializeSocket();
    }

    return () => {
      socket?.disconnect();
    };
  }, [initializeSocket, socket]);

  const handleUserClick = (userId: string) => {
    const clickedUser = chatUsers.find(
      (chatUser) => chatUser.otherUser._id === userId
    );
    if (clickedUser) {
      setSelectedChatUserId(userId);
      setSelectedChatUserDetails(clickedUser.otherUser);
    }
  };

  const handleNewMessage = (userId: string, newMessage: LastMessage) => {
    setChatUsers((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.otherUser._id === userId
          ? {
              ...chat,
              lastMessage: newMessage,
              unreadMessages:
                chat.unreadMessages + (userId !== selectedChatUserId ? 1 : 0),
            }
          : chat
      );

      return updatedChats.sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
      );
    });
  };

  const handleMessagesRead = (userId: string) => {
    setChatUsers((prevChats) =>
      prevChats.map((chat) =>
        chat.otherUser._id === userId ? { ...chat, unreadMessages: 0 } : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans">
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
        {ongoingCall && (
          <div className="absolute insert-0 z-50">
            <CallNotification />
            <Videocall />
          </div>
        )}
        <div className="flex justify-between pb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-1 h-11 w-16 text-white rounded-xl hover:bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <MdOutlineKeyboardBackspace className="h-10 w-10" />
          </button>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/4 bg-[#0d0d0d] rounded-lg p-4 mr-4 overflow-y-auto">
            <div>
              <h1 className="text-4xl font-bold mb-8 flex items-center  justify-around">
                CHATS
                <IoIosChatbubbles className="mr-3 text-purple-400" />
              </h1>
            </div>
            {chatUsers.length || selectedChatUserId ? (
              <ul>
                {chatUsers.map((chatUser) => (
                  <li
                    key={chatUser.otherUser._id}
                    className={`flex items-center mb-4 p-2 rounded-xl cursor-pointer transition duration-300 ${
                      selectedChatUserId === chatUser.otherUser._id
                        ? "bg-purple-400 text-black"
                        : "bg-[#1b1b1b] hover:bg-gray-600"
                    }`}
                    onClick={() => handleUserClick(chatUser.otherUser._id)}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">
                        {chatUser.otherUser.fullname.charAt(0).toUpperCase() +
                          chatUser.otherUser.fullname.slice(1)}
                      </div>
                      {chatUser.lastMessage.image ? (
                        <div className="text-sm opacity-75">
                          {chatUser.lastMessage.senderId === currentUserId
                            ? "Me"
                            : chatUser.lastMessage.senderName}
                          : <span>📷 Photo</span>
                        </div>
                      ) : (
                        chatUser.lastMessage.messageText && (
                          <div className="text-sm opacity-75">
                            {chatUser.lastMessage.senderId === currentUserId
                              ? "Me"
                              : chatUser.lastMessage.senderName}
                            : {chatUser.lastMessage.messageText}
                          </div>
                        )
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>
                No chat yet{" "}
                <span
                  className="text-purple-400 underline cursor-pointer"
                  onClick={() => router.push("/connect")}
                >
                  show connections
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 bg-[#0d0d0d] rounded-lg p-4 overflow-y-auto">
            {currentUserId && selectedChatUserId ? (
              <CheckChat
                currentUserId={currentUserId}
                otherUserId={selectedChatUserId}
                otherUserDetails={selectedChatUserDetails as User}
                onNewMessage={handleNewMessage}
                onMessagesRead={handleMessagesRead}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="loading loading-dots loading-xl"></span>
                <p className="text-xl text-center font-extrabold">
                  PLEASE SELECT A CHAT BOX
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
