"use client";
import { useEffect, useRef, useState } from "react";
import Input from "../../components/chat/Input";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import useStore from "@/store/user";
import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
type User = {
  id?: string;
  fullName?: string;
  email?: string;
  receiverId?: string;
};
interface Conversation {
  conversationId: string;
  user: User;
}

type Messages = {
  message: string;
  senderId: string;
};

const Dashboard = () => {
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const [conversations, setConversations] = useState([]);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get(`${BASE_URL}/api/GetQuestions`, {
        withCredentials: true,
      });
      console.log(response.data.data);
      setQuestionData(response.data.data);
    };
    fetchQuestions();
  }, [setQuestionData]);

  const modalRef = useRef<HTMLDialogElement>(null);
  const modalRefForAns = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const openModalAns = (questionId: string) => {
    setSelectedQuestionId(questionId);
    if (modalRefForAns.current) {
      modalRefForAns.current.showModal();
    }
  };

  const handleSave = async () => {
    console.log(user.fullname);
    const response = await axios.post(
      `${BASE_URL}/api/addQuestions`,
      { question, email: user.email, name: user.fullname },
      {
        withCredentials: true,
      }
    );
  };

  const handleAnswerSave = async () => {
    console.log(answer, user._id, selectedQuestionId);
    const response = await axios.post(
      `${BASE_URL}/api/addAnswers`,
      {
        answer: answer,
        userId: user._id,
        questionId: selectedQuestionId,
        email: user.email,
      },
      {
        withCredentials: true,
      }
    );
  };

  return (
    <div className="w-screen flex ">
      <div className="w-[25%] h-screen overflow-scroll bg-black">
        <div className="flex items-center my-8 mx-14">
          {/* <div><img src={tutorialsdev} width={75} height={75} className='border border-primary p-[2px] rounded-full' /></div> */}
          <div className="ml-8 text-black ">
            <h3 className="text-2xl font-extrabold">{user?.fullname}</h3>
            {/* <p className="text-lg font-light">My Accounasasat</p> */}
          </div>
        </div>
        <hr />
        <div className="mx-14 mt-10">
          {/* <div className="text-primary text-lg">Messages</div> */}
          <div>
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, user }: Conversation, i) => {
                return (
                  <div
                    key={i}
                    className="flex items-center py-8 border-b border-b-gray-300"
                  >
                    <div
                      className="cursor-pointer flex items-center"
                      // onClick={() => fetchMessages(conversationId, user)}
                    >
                      {/* <div><img src={Img1} className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div> */}
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold">
                          {user?.fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                user list
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[100%] h-screen bg-black flex flex-col items-center">
        {
          // messages?.receiver?.fullName &&
          <div className="w-[75%]  bg-gray-700 h-[80px] my-14 rounded-full flex items-center px-14 py-2">
            {/* <div className='cursor-pointer'><img src={Img1} width={60} height={60} className="rounded-full" /></div> */}
            <div className="ml-6 mr-auto">
              <h1 className='text-lg'> name of the community</h1>
              {/* <h3 className='text-lg'>{messages?.receiver?.fullName}</h3> */}
              {/* <p className='text-sm font-light text-gray-600'>{messages?.receiver?.email}</p> */}
            </div>
            <div className="cursor-pointer"></div>
          </div>
        }

        <div className="h-[75%] w-full overflow-y-auto bg-gray-900 text-white shadow-lg">
          <div className="bg-gray-800 p-6 mb-4 rounded-t-lg">
            <h1 className="text-2xl font-semibold">Ask Questions</h1>
          </div>

          {questionData?.map((q: any, i: any) => (
            <div key={i} className="p-6 bg-gray-800 rounded-b-lg shadow-md hap border border-black">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-200">Question</h2>
                <IoIosAddCircleOutline
                  onClick={() => openModalAns(q._id)}
                  className="text-gray-400 cursor-pointer hover:text-gray-300 transition duration-300"
                />
              </div>
              <span>{q.name}</span>
              <p className="text-gray-400 mt-2">{q.question}.</p>
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mt-4">
                  Answers
                </h3>
                <ul className="mt-2 space-y-2">
                  {q.answers.map((answer: any) => (
                    <li
                      key={answer._id}
                      className="p-4 bg-gray-700 rounded-lg shadow-sm"
                    >
                      <span className="text-sm">
                        User {answer.userId.fullname} :{" "}
                        <span className="text-gray-400">{answer.content}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          <div className="p-6">
            <button
              onClick={openModal}
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 transition duration-300"
            >
              Post Question
            </button>
          </div>
        </div>

        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box">
            <h3 className="font-bold text-lg "> CREATE QUESTIONS</h3>
            <div>
              <input
                type="text"
                onChange={(e) => setQuestion(e.target.value)}
                className="bg-[#343434] rounded-lg w-full h-20 p-4"
              />
              <button onClick={handleSave}>save</button>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog id="my_modal_1" className="modal" ref={modalRefForAns}>
          <div className="modal-box">
            <h3 className="font-bold text-lg "> ANSWER QUESTION</h3>
            <div>
              <input
                type="text"
                onChange={(e) => setAnswer(e.target.value)}
                className="bg-[#343434] rounded-lg w-full h-20 p-4"
              />
              <button onClick={handleAnswerSave}>save</button>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default Dashboard;
