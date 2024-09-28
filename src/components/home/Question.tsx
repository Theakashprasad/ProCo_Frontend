"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Input from "../../components/chat/Input";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import useStore from "@/store/user";
import axios from "axios";
import { IoIosAddCircleOutline, IoIosCloseCircle } from "react-icons/io";
import { format } from "date-fns";
import { toast } from "sonner";

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

type props = {
  userId: string;
};

const Question = ({ userId }: props) => {
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [questionData, setQuestionData] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );

  const fetchQuestions = useCallback(async () => {
    const response = await axios.get(`${BASE_URL}/api/GetQuestions/${userId}`, {
      withCredentials: true,
    });
    console.log(response.data.data);
    setQuestionData(response.data.data);
  },[userId]);
  
  useEffect(() => {
    fetchQuestions();
  }, [setQuestionData, fetchQuestions]);

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
    if (question) {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/addQuestions`,
          {
            question,
            email: user.email,
            name: user.fullname,
            communityId: userId,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          toast.success("Question has been posted");
          fetchQuestions(); // Refresh the list of questions
          setQuestion(""); // Clear the question input
          if (modalRef.current) modalRef.current.close(); // Close the modal
        }
      } catch (error) {
        console.error("Error saving the question:", error);
      }
    } else {
      console.log("Question cannot be empty");
    }
  };

  const handleAnswerSave = async () => {
    if (answer) {
      try {
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

        if (response.data.success) {
          fetchQuestions(); // Refresh the list of questions with new answers
          setAnswer(""); // Clear the answer input
          setSelectedQuestionId(null); // Clear the selected question
          if (modalRefForAns.current) modalRefForAns.current.close(); // Close the modal
        }
      } catch (error) {
        console.error("Error saving the answer:", error);
      }
    } else {
      console.log("Answer cannot be empty");
    }
  };

  return (
    <div className="w-screen flex">
      <div className="w-[100%] h-screen bg-[#0d0d0d] flex flex-col items-center p-8">
        <div className="h-[100%] w-full overflow-y-auto bg-[#0d0d0d] text-white shadow-lg rounded-lg">
          <div className="border border-gray-600 p-6 mb-4 rounded-t-lg shadow-md">
            <h1 className="text-2xl font-bold">ASK QUESTIONS</h1>
          </div>

          {questionData?.map((q: any, i: any) => (  
            <div
              key={i}
              className="p-6 bg-[#0d0d0d] mb-6 rounded-lg shadow-md border border-gray-600"
            >
              <div className="flex items-center justify-between ">
                <h2 className="text-xl flex font-semibold text-gray-400">
                  Q)
                  <p className="text-white text-lg">. {q.question}</p>
                </h2>
                <IoIosAddCircleOutline
                  onClick={() => openModalAns(q._id)}
                  className="text-gray-300 cursor-pointer hover:text-green-400 transition duration-400"
                  size={30}
                />
              </div>
              <p className="text-gray-400 font-extrabold text-sm">
                created by {q.name}
              </p>
              <p className="text-gray-500 font-extrabold text-xs">
                {q?.createdAt
                  ? format(new Date(q?.createdAt), "MMMM dd, yyyy • HH:mm")
                  : "Date not available"}
              </p>

              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-gray-400">
                  ANSWERS
                </h3>
                <ul className="mt-2 space-y-4">
                  {q.answers.length == 0
                    ? "Add answers ->"
                    : q.answers.map((answer: any) => (
                        <li
                          key={answer._id}
                          className="p-4 bg-[#232323] rounded-lg shadow-sm"
                        >
                          <span className="text-sm text-gray-400">
                            {answer.userId.fullname}:
                          </span>
                          <span className="text-white ml-2">
                            {answer.content}
                          </span>
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6">
          <button
            // onClick={openModal}
            className=" text-white font-semibold rounded-lg shadow-md "
          ></button>

          <button
            onClick={openModal}
            className="relative -top-1 -left-1 w-full py-3 px-4 bg-blue-600 hover:bg-blue-400 duration-300 font-semibold rounded-lg uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0"
          >
            Post Question
          </button>
        </div>

        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box bg-[#232323] p-8 rounded-lg shadow-lg">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn absolute top-2 right-2 text-white font-semibold rounded-lg hover:bg-red-400 transition duration-300">
                  <IoIosCloseCircle className="w-7 h-7" />
                </button>
              </form>
            </div>
            <h3 className="font-bold text-xl mb-4 text-blue-400">
              CREATE QUESTIONS
            </h3>
            <input
              type="text"
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-[#343434] text-white rounded-lg w-full h-20 p-4 mb-6"
              placeholder="Enter your question"
            />

            <div className="flex justify-center modal-action">
              <button
                onClick={handleSave}
                className="btn py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </dialog>

        <dialog id="my_modal_1" className="modal" ref={modalRefForAns}>
          <div className="modal-box bg-[#232323] p-8 rounded-lg shadow-lg">
            <div className="modal-action">
              <form method="dialog">
                <button className="btn absolute top-2 right-2 text-white font-semibold rounded-lg hover:bg-red-400 transition duration-300">
                  <IoIosCloseCircle className="w-7 h-7" />
                </button>
              </form>
            </div>
            <h3 className="font-bold text-xl mb-4 text-green-400">
            ANSWER QUESTION
            </h3>
            <input
              type="text"
              onChange={(e) => setAnswer(e.target.value)}
              className="bg-[#343434] text-white rounded-lg w-full h-20 p-4 mb-6"
              placeholder="Enter your question"
            />

            <div className="flex justify-center modal-action">
              <button
                  onClick={handleAnswerSave}
                  className="btn py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 transition duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </dialog>

        
      </div>
    </div>
  );
};

export default Question;
