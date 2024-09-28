// "use client";
// import { useEffect, useRef, useState } from "react";
// import Input from "../../components/chat/Input";
// import { io, Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
// import { MdOutlineKeyboardBackspace } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Room from "../Room/page";
// import AiChat from "../aiChat/page";
// import Community from "@/components/Community/community";
// import Chat from "@/components/Category/AiChat/Chat";

// const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// type User = {
//   id?: string;
//   fullName?: string;
//   email?: string;
//   receiverId?: string;
// };
// interface Conversation {
//   conversationId: string;
//   user: User;
//   createdAt: string;
// }

// type Messages = {
//   message: string;
//   user: User;
//   createdAt: string;
// };
// interface Message {
//   conversationId?: string;
//   messages: Messages[];
//   receiver?: User;
// }

// const Dashboard = () => {
//   const storedUserDetail = localStorage.getItem("userDetail");
//   const initialUserState = storedUserDetail
//     ? JSON.parse(storedUserDetail)
//     : null;
//   const [user, setUser] = useState(initialUserState);
//   const [conversations, setConversations] = useState([]);
//   const [messages, setMessages] = useState<Message | null>(null);
//   const [message, setMessage] = useState("");
//   const [isClick, setIsClick] = useState(1);
//   const [users, setUsers] = useState<any | null>([]);
//   const [socket, setSocket] = useState<Socket<
//     DefaultEventsMap,
//     DefaultEventsMap
//   > | null>(null);
//   const messageRef = useRef<HTMLDivElement | null>(null);
//   const router = useRouter();

//   // console.log("conversations", conversations);
//   // useEffect(() => {
//   //   setSocket(io("http://localhost:8080"));
//   // }, []);

//   // useEffect(() => {
//   //   socket?.emit("addUser", user?._id);
//   //   socket?.on("getUsers", (users) => {
//   //     // console.log('activeUsers :>> ', users);
//   //   });
//   //   socket?.on("getMessage", (data) => {
//   //     setMessages((prev) => ({
//   //       ...prev,
//   //       messages: [
//   //         ...(prev?.messages || []),
//   //         { user: data.user, message: data.message, createdAt: data.createdAt },
//   //       ],
//   //     }));
//   //   });
//   // }, [socket]);

//   useEffect(() => {
//     messageRef?.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages?.messages]);

//   useEffect(() => {
//     // const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
//     const fetchConversations = async () => {
//       const res = await fetch(`${BASE_URL}/api/conversations/${user?._id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const resData = await res.json();
//       const sortedConversations = resData.sort(
//         (a: Conversation, b: Conversation) =>
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
//       );
//       setConversations(sortedConversations);
//     };
//     fetchConversations();
//   }, []);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const res = await fetch(`${BASE_URL}/api/users/${user?._id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const resData = await res.json();
//       setUsers(resData);
//     };
//     fetchUsers();
//   }, []);

//   const fetchMessages = async (conversationId: string, receiver: User) => {
//     // console.log('receiver', receiver);

//     const res = await fetch(
//       `${BASE_URL}/api/message/${conversationId}?senderId=${user?._id}&&receiverId=${receiver?.receiverId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const resData = await res.json();
//     setMessages({ messages: resData, receiver, conversationId });
//   };
//   // console.log(messages?.receiver);

//   const sendMessage = async () => {
//     setMessage("");
//     const createdAt = Date.now();
//     socket?.emit("sendMessage", {
//       senderId: user?._id,
//       receiverId: messages?.receiver?.receiverId,
//       message,
//       createdAt,
//       conversationId: messages?.conversationId,
//     });
//     const res = await fetch(`${BASE_URL}/api/message`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         conversationId: messages?.conversationId,
//         senderId: user?._id,
//         message,
//         receiverId: messages?.receiver?.receiverId,
//       }),
//     });
//   };
//   const formatDate = (dateString: any) => {
//     const date = new Date(dateString);
//     return date.toLocaleTimeString(); // Adjust formatting as needed
//   };
//   return (
//     <>
//       <div className=" bg-white w-full">
//         <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b bg-[#0d0d0d] border-neutral-700/80">
//           <div className="container px-4 mx-auto relative lg:text-sm">
//             <div className="flex justify-between items-center">
//               <div className="flex justify-between ">
//                 <button
//                   type="button"
//                   onClick={() => router.back()}
//                   className="p-1 h-11 w-16 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500"
//                 >
//                   <MdOutlineKeyboardBackspace className="h-10 w-10" />
//                 </button>
//               </div>

//               <ul className="hidden lg:flex ml-14 space-x-12">
//                 <li>
//                   <button
//                     onClick={() => setIsClick(1)}
//                     className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]"
//                   >
//                     POMODORO
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setIsClick(2)}
//                     className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]"
//                   >
//                     COMMUNITY
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setIsClick(3)}
//                     className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]"
//                   >
//                     GROUP VIDEO
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//                 <li>
//                   <button
//                     onClick={() => setIsClick(4)}
//                     className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]"
//                   >
//                     AI-chat
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//                 <li>
//                   <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
//                     TODO
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//                 <li>
//                   <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
//                     TIMER
//                     <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
//                   </button>
//                 </li>
//               </ul>
//               <div className="flex items-center flex-shrink-0">
//                 <span className="text-xl font-serif tracking-tight font-extrabold pl-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
//                   ProCo .
//                 </span>
//               </div>
//             </div>
//           </div>
//         </nav>
//       </div>
//       {isClick == 1 && (
//         <div>under work</div>
//         // <div className="w-screen flex">
//         //   <div className="w-[25%] bg-[#0d0d0d] h-screen overflow-scroll">
//         //     <div className="flex items-center my-8 mx-6">
//         //       <div>
//         //         <Image
//         //           alt="no image"
//         //           src="data:image/jpeg;base64,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"
//         //           width={75}
//         //           height={75}
//         //           className="border border-primary p-[2px] rounded-full"
//         //         />
//         //       </div>
//         //       <div className="ml-8 ">
//         //         <h3 className="text-xl text-white font-extrabold uppercase">
//         //           {user?.fullname}
//         //         </h3>
//         //         <p className="text-sm">My Account</p>
//         //       </div>
//         //     </div>
//         //     <hr />
//         //     <div className="mx-14 mt-6 ">
//         //       <div className="text-primary font-semibold text-lg">Messages</div>
//         //       <div>
//         //         {conversations.length > 0 ? (
//         //           conversations.map(
//         //             ({ createdAt, conversationId, user }: Conversation, i) => {
//         //               return (
//         //                 <div
//         //                   key={i}
//         //                   className="flex items-center py-4 border-b border-b-gray-600"
//         //                 >
//         //                   <div
//         //                     className="cursor-pointer flex items-center"
//         //                     onClick={() => fetchMessages(conversationId, user)}
//         //                   >
//         //                     <div>
//         //                       <Image
//         //                         alt="no image"
//         //                         src="data:image/jpeg;base64,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"
//         //                         width={15}
//         //                         height={15}
//         //                         className="w-[50px] h-[50px] rounded-full p-[2px] border border-primary"
//         //                       />
//         //                     </div>
//         //                     <div className="ml-6">
//         //                       <h3 className="text-lg font-semibold">
//         //                         {user?.fullName}
//         //                       </h3>
//         //                       <div className="text-xs text-gray-500">
//         //                         {formatDate(createdAt)}
//         //                       </div>
//         //                     </div>
//         //                   </div>
//         //                 </div>
//         //               );
//         //             }
//         //           )
//         //         ) : (
//         //           <div className="text-center text-lg font-semibold mt-24">
//         //             No Conversations
//         //           </div>
//         //         )}
//         //       </div>
//         //     </div>
//         //   </div>
//         //   <div className="w-[50%] h-screen bg-[#1d1d1d]  flex flex-col items-center">
//         //     {messages?.receiver?.fullName && (
//         //       <div className="w-[75%] bg-zinc-800 h-[80px] my-14 rounded-full flex items-center px-14 py-2 border border-gray-600">
//         //         <div className="cursor-pointer">
//         //           <Image
//         //             src="data:image/jpeg;base64,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"
//         //             width={50}
//         //             height={50}
//         //             alt="no image"
//         //             className="rounded-full"
//         //           />
//         //         </div>
//         //         <div className="ml-6 mr-auto ">
//         //           <h3 className="text-lg text-white uppercase font-semibold">
//         //             {messages?.receiver?.fullName}
//         //           </h3>
//         //         </div>
//         //         <div className="cursor-pointer">
//         //           {/* <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone-outgoing" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" fill="none" stroke-linecap="round" stroke-linejoin="round">
//         // 				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
//         // 				<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
//         // 				<line x1="15" y1="9" x2="20" y2="4" />
//         // 				<polyline points="16 4 20 4 20 8" />
//         // 			</svg> */}
//         //         </div>
//         //       </div>
//         //     )}
//         //     <div className="h-[75%] w-full overflow-scroll shadow-sm">
//         //       <div className="p-14">
//         //         {messages && messages?.messages.length > 0 ? (
//         //           messages.messages.map(
//         //             ({ createdAt, message, user: { id } = {} }, i) => {
//         //               return (
//         //                 <>
//         //                   <div key={i}>
//         //                     <div
//         //                       className={`max-w-[40%] rounded-b-xl p-4 mb-6 ${
//         //                         id === user?._id
//         //                           ? "bg-purple-800 text-white rounded-tl-xl ml-auto"
//         //                           : "bg-gray-600 rounded-tr-xl"
//         //                       } `}
//         //                     >
//         //                       {message}
//         //                       <div className="text-xs text-gray-500">
//         //                         {formatDate(createdAt)}
//         //                       </div>
//         //                     </div>
//         //                     <div ref={messageRef}></div>
//         //                   </div>
//         //                 </>
//         //               );
//         //             }
//         //           )
//         //         ) : (
//         //           <div className="text-center text-lg font-semibold mt-24">
//         //             No Messages or No Conversation Selected
//         //           </div>
//         //         )}
//         //       </div>
//         //     </div>
//         //     {messages?.receiver?.fullName && (
//         //       <div className="p-10 w-full flex items-center justify-center">
//         //         <Input
//         //           placeholder="Type a message..."
//         //           value={message}
//         //           onChange={(e) => setMessage(e.target.value)}
//         //           className="w-[75%] text-black"
//         //           inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
//         //         />
//         //         <div
//         //           className={`ml-4 p-2 cursor-pointer bg-light rounded-full  ${
//         //             !message && "pointer-events-none"
//         //           }`}
//         //           onClick={() => sendMessage()}
//         //         >
//         //           <svg
//         //             xmlns="http://www.w3.org/2000/svg"
//         //             className="icon icon-tabler icon-tabler-send"
//         //             width="30"
//         //             height="30"
//         //             viewBox="0 0 24 24"
//         //             stroke-width="1.5"
//         //             stroke="#f7fbff"
//         //             fill="none"
//         //             stroke-linecap="round"
//         //             stroke-linejoin="round"
//         //           >
//         //             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//         //             <line x1="10" y1="14" x2="21" y2="3" />
//         //             <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
//         //           </svg>
//         //         </div>
//         //         {/* <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${!message && 'pointer-events-none'}`}>
//         // 			<svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
//         // 				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
//         // 				<circle cx="12" cy="12" r="9" />
//         // 				<line x1="9" y1="12" x2="15" y2="12" />
//         // 				<line x1="12" y1="9" x2="12" y2="15" />
//         // 			</svg>
//         // 		</div> */}
//         //       </div>
//         //     )}
//         //   </div>
//         //   <div className="w-[25%] bg-[#0d0d0d] h-screen px-8 py-12 overflow-scroll">
//         //     <div className="text-primary font-semibold text-lg">People</div>
//         //     <div>
//         //       {users.length > 0 ? (
//         //         users.map(({ userId, user }: any, i: any) => {
//         //           return (
//         //             <div
//         //               key={i}
//         //               className="flex items-center py-4 border-b border-b-gray-700"
//         //             >
//         //               <div
//         //                 className="cursor-pointer flex items-center"
//         //                 onClick={() => fetchMessages("new", user)}
//         //               >
//         //                 <div>
//         //                   <Image
//         //                     alt="no image"
//         //                     width={50}
//         //                     height={10}
//         //                     src="data:image/jpeg;base64,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"
//         //                     className="w-[50px] h-[50px] rounded-full p-[2px] border border-primary"
//         //                   />
//         //                 </div>
//         //                 <div className="ml-6">
//         //                   <h3 className="text-sm font-semibold">
//         //                     {user?.fullName}
//         //                   </h3>
//         //                   <p className="text-sm font-light text-gray-600">
//         //                     {user?.email}
//         //                   </p>
//         //                 </div>
//         //               </div>
//         //             </div>
//         //           );
//         //         })
//         //       ) : (
//         //         <div className="text-center text-lg font-semibold mt-24">
//         //           No Conversations
//         //         </div>
//         //       )}
//         //     </div>
//         //   </div>
//         // </div>
//       )}{" "}
//       {isClick == 2 && <Community />}
//       {isClick == 3 && <Room />}
//       {isClick == 4 && <Chat />}
//     </>
//   );
// };

// export default Dashboard;
