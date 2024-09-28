"use client";
import { useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import Chat from "@/components/Category/AiChat/Chat";
import Todo from "@/components/Category/Todo/toDo";
import PomoMain from "@/components/Category/Pomodoro/PomoMain";

const Category = () => {
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const [isClick, setIsClick] = useState(1);
  const router = useRouter();

  return (
    <>
      <div className=" bg-white w-full">
        <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b bg-[#0d0d0d] border-neutral-700/80">
          <div className="container px-4 mx-auto relative lg:text-sm">
            <div className="flex justify-between items-center">
              <div className="flex justify-between ">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="p-1 h-11 w-16 text-white rounded-xl hover:bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  <MdOutlineKeyboardBackspace className="h-10 w-10" />
                </button>
              </div>

              <ul className="hidden lg:flex ml-14 space-x-12">
                <li>
                <button
                    onClick={() => setIsClick(1)}
                    className={`font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px] ${
                      isClick === 1 ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    POMODORO
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </li>
                <li>
                <button
                    onClick={() => setIsClick(2)}
                    className={`font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px] ${
                      isClick === 2 ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    AI-chat
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </li>
                <li>
                <button
                    onClick={() => setIsClick(3)}
                    className={`font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px] ${
                      isClick === 3 ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    TODO
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </li>
                {/* <li>
                <button
                    onClick={() => setIsClick(4)}
                    className={`font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px] ${
                      isClick === 4 ? "border-b-2 border-blue-500" : ""
                    }`}
                  >
                    QUIZZ
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
                  </button>
                </li> */}
              </ul>
              <div className="flex items-center flex-shrink-0">
                <span className="text-xl font-serif tracking-tight font-extrabold pl-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
                  ProCo .
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>
      {isClick == 1 && <PomoMain />}
      {isClick == 2 && <Chat />}
      {isClick == 3 && <Todo />}
      {/* {isClick == 6 && <ChatPage />} */}
    </>
  );
};

export default Category;
