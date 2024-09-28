"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa";
import { IoIosChatbubbles } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { getUserChats } from "@/services/chatApi";
import { fetchUserById } from "@/services/userApi";
import Chat from "@/components/chat";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

interface LastMessage {
  _id: string;
  messageText: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  image: string;
}

interface OtherUser {
  _id: string;
  fullname: string;
  email: string;
  profilePhoto: string;
}

interface Chat {
  _id: string;
  lastMessage: LastMessage;
  otherUser: OtherUser;
  unreadMessages: number;
}

const ChatPage = () => {
    const storedUserDetail = localStorage.getItem("userDetail");
    const initialUserState = storedUserDetail
      ? JSON.parse(storedUserDetail)
      : null;
    const [user, setUser] = useState(initialUserState);
  const params = useParams();
  const router = useRouter();
  const user1Id = user?._id;
  const [chatUsers, setChatUsers] = useState<Chat[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
     
    const fetchUserChats = async () => {
      if (user1Id) {        
        try {
          const chats = await getUserChats(user1Id);
          console.log(chats, "chatil nthokke und");

          const sortedChats = chats.sort( 
            (a: Chat, b: Chat) =>
              new Date(b.lastMessage.createdAt).getTime() -
              new Date(a.lastMessage.createdAt).getTime()
          );

          setChatUsers(sortedChats);

          if (sortedChats.length > 0) {
            const validChat = sortedChats.find(
              (chat: Chat) => chat.otherUser._id === params.chatUserId
            );

            if (validChat) {
              setSelectedUserId(params.chatUserId as string);
            } else if (params.chatUserId) {
              const newUserDetails = await fetchUserById(
                token as string,
                params.chatUserId as string
              );
              
              setSelectedUserId(params.chatUserId as string);

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
                  otherUser: newUserDetails.data,
                  unreadMessages: 0,
                },
                ...sortedChats,
              ]);
            } else {
              setSelectedUserId(sortedChats[0].otherUser._id);
              router.push(`/chat/${sortedChats[0].otherUser._id}`);
            }
          } else if (params.chatUserId) {
            console.log('else if')
            const newUserDetails = await fetchUserById(
              token as string,
              params.chatUserId as string
            );
            console.log(newUserDetails,'para user')
            setSelectedUserId(params.chatUserId as string);

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
                otherUser: newUserDetails.data,
                unreadMessages: 0,
              },
            ]);
            console.log(chatUsers.map((user)=>user.otherUser),'while para')
          }else{
            setChatUsers([])
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
  }, [user1Id, params.chatUserId]);

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleNewMessage = (chatId: string, newMessage: LastMessage) => {
    setChatUsers((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat._id === chatId ? { ...chat, lastMessage: newMessage } : chat
      );

      return updatedChats.sort(
        (a, b) =>
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
      );
    });
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
       
      <main className="flex-1 flex flex-col p-8 overflow-hidden">
      <div className="flex justify-between pb-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1 h-11 w-16 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <MdOutlineKeyboardBackspace className="h-10 w-10" />
            </button>
          </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/4 bg-gray-800 rounded-lg p-4 mr-4 overflow-y-auto">
            <div>
              <h1 className="text-4xl font-bold mb-8 flex items-center">
                <IoIosChatbubbles className="mr-3 text-purple-400" /> Your Chats
              </h1>
            </div>
            {chatUsers.length || selectedUserId?(
            <ul>
           {chatUsers.map((chatUser) => (
                <li
                  key={chatUser.otherUser._id}
                  className={`flex items-center mb-4 p-2 rounded-lg cursor-pointer transition duration-300 ${
                    selectedUserId === chatUser.otherUser._id
                      ? "bg-purple-400 text-black"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  onClick={() => handleUserClick(chatUser.otherUser._id)}
                >
                  {/* <img
                    className="w-10 h-10 rounded-full mr-3"
                    src={
                      chatUser.otherUser.profilePhoto || "/default-profile.jpg"
                    }
                    alt={chatUser.otherUser.fullname}
                  /> */}
                  <div className="flex-1">
                    <div className="font-semibold">
                      {chatUser.otherUser.fullname.charAt(0).toUpperCase() +
                        chatUser.otherUser.fullname.slice(1)}
                    </div>
                    {chatUser.lastMessage.image ? (
                      <div className="text-sm opacity-75">
                        {chatUser.lastMessage.senderId === user1Id
                          ? "Me"
                          : chatUser.lastMessage.senderName}
                        : <span>📷 Photo</span>
                      </div>
                    ) : (
                      chatUser.lastMessage.messageText && (
                        <div className="text-sm opacity-75">
                          {chatUser.lastMessage.senderId === user1Id
                            ? "Me"
                            : chatUser.lastMessage.senderName}
                          : {chatUser.lastMessage.messageText}
                        </div>
                      )
                    )}
                  </div>
                  {/* {chatUser.unreadMessages > 0 && (
                    <div className="ml-3 px-2 py-1 bg-gray-900 text-white text-sm rounded-3xl flex float-end">
                      {chatUser.unreadMessages}
                    </div>
                  )} */}
                </li>
              ))}
            </ul>
             ):(
              <div>No chat yet <span className="text-yellow-400 underline cursor-pointer" onClick={()=>router.push('/connections')}>show connections</span></div>
             )}
             
          </div>

          <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
            {user1Id && selectedUserId ? (
              <Chat
                currentUserId={user1Id}
                otherUserId={selectedUserId}
                onNewMessage={handleNewMessage}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FaUsers className="text-purple-400 text-6xl mb-4" />
                <p className="text-xl text-center">
                  Select a chat to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;