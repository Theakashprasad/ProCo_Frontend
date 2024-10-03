"use client";

import { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { Plus } from "lucide-react";
// import Nav from "@/components/Home/Navbar";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "sweetalert2/src/sweetalert2.scss";
import axiosInstance from "@/lib/axios";
import { format } from "date-fns";

interface ToDoItem {
  _id: string;
  text: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

function Todo() {
  const [toDos, setToDos] = useState<ToDoItem[]>([]);
  const [completedTodos, setCompletedTodos] = useState<ToDoItem[]>([]);
  const [toDo, setToDo] = useState<string>("");
  const [isCompletedScreen, setIsCompletedScreen] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [edit, setEdit] = useState(false);
  const { theme } = useTheme();
  const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const fetchTodos = async () => {
      if (!user) {
        console.error("User details not found in local storage");
        return;
      }
      const userId = user._id;

      try {
        const toDoData = await axiosInstance.get("/api/todos", {
          params: { userId },
        });

        const toDoComplete = await axiosInstance.get("/api/completedtodos", {
          params: { userId },
        });
        console.log(toDoData.data.todos);

        setToDos(toDoData.data.todos);
        setCompletedTodos(toDoComplete.data.completedTodos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchTodos();
  }, [BASE_URL, user]);

  const getCurrentDay = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date();
    return days[date.getDay()];
  };

  const dataAdding = async () => {
    if (!user) {
      console.error("User details not found in local storage");
      return;
    }
    const userId = user._id;

    if (toDo === "") return;
    const newToDo: ToDoItem = {
      text: toDo,
      status: false,
      userId,
      _id: "dummy",
      createdAt: new Date().toISOString(), // Current timestamp
      updatedAt: new Date().toISOString(), // Current timestamp
    };
    setToDos([newToDo, ...toDos]);
    setToDo("");

    try {
      await axiosInstance.post("/api/toDoPost", newToDo);
      toast.success("To-do added successfully!");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToDoDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reducedTodos = toDos.filter((todo) => todo._id !== id);
        setToDos(reducedTodos);
        try {
          await axiosInstance.delete(`/api/todoDel/${id}`);
          toast.success("To-do deleted successfully!");
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      }
    });
  };

  const handleComplete = async (id: string) => {
    console.log("toDos", toDos);

    const completedTodo = toDos.find((todo) => todo._id === id);
    console.log(completedTodo);

    if (completedTodo) {
      const updatedTodo = { ...completedTodo, status: true };
      setCompletedTodos([...completedTodos, updatedTodo]);
      const reducedTodos = toDos.filter((todo) => todo._id !== id);
      setToDos(reducedTodos);
      //   setToDos(completedTodo);

      try {
        await axiosInstance.post("/api/completedtodosPost", {
          updatedTodo,
        });
        toast.success("To-do marked as completed!");
      } catch (error) {
        console.error("Error marking todo as completed:", error);
      }
    }
  };

  const handleCompletedTodoDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const reducedCompletedTodos = completedTodos.filter(
          (todo) => todo._id !== id
        );
        setCompletedTodos(reducedCompletedTodos);
        try {
          await axiosInstance.delete(`/api/completedtodoDel/${id}`);
          toast.success("Completed to-do deleted successfully!");
        } catch (error) {
          console.error("Error deleting completed todo:", error);
        }
      }
    });
  };

  return (
    <>
      <div
        className={`app mt-10 absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/10  ${
          theme === "dark" ? " text-white" : " text-black"
        }`}
      >
        <div className="subHeading mt-4">
          <h2 className="text-center text-sm sm:text-2xl text-white uppercase">
            WHAT IS YOU PLAN FOR THIS {getCurrentDay()}
          </h2>
        </div>
        <div className="input flex justify-center items-center mt-3">
          <input
            value={toDo}
            onChange={(e) => setToDo(e.target.value)}
            type="text"
            placeholder="🖊️ Add item..."
            className={`sm:w-80 h-8 ${
              theme === "dark"
                ? "bg-gray-700 text-white "
                : "bg-white border border-orange-500 text-white"
            } rounded-xl p-2`}
          />
          <Plus
            onClick={dataAdding}
            className={`cursor-pointer text-2xl ${
              theme === "dark" ? "text-white" : "text-white"
            }`}
          />
        </div>
        <div className="todos flex flex-col items-center mt-4">
          <div className="btn-area mb-2">
            <button
              className={`secondaryBtn px-4 py-2 rounded-t-xl ${
                isCompletedScreen === false && "bg-green-600"
              }`}
              onClick={() => setIsCompletedScreen(false)}
            >
              To Do
            </button>
            <button
              className={`secondaryBtn px-4 py-2 rounded-t-xl ml-2 ${
                isCompletedScreen === true && "bg-green-600"
              }`}
              onClick={() => setIsCompletedScreen(true)}
            >
              Completed
            </button>
          </div>
          <div className="todo-list w-full max-w-md">
            {isCompletedScreen === false &&
              toDos.map((item, index) => (
                <div
                  className={`todo-list-item flex justify-between items-center rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } p-2 rounded-lg mb-2 shadow-lg`}
                  key={index}
                >
                  <div>
                    {edit ? (
                      <input
                        type="text"
                        className={`w-28 ${
                          theme === "dark"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-black"
                        } rounded-md p-1`}
                        defaultValue={item.text}
                      />
                    ) : (
                      <h3 className="text-green-500 font-bold">{item.text}</h3>
                    )}
                  </div>
                  <div className="flex items-center">
                    <BsCheckLg
                      title="Completed?"
                      className="check-icon text-green-500 text-3xl ml-2 cursor-pointer"
                      onClick={() => handleComplete(item._id)}
                    />
                    <AiOutlineDelete
                      title="Delete?"
                      className="icon text-xl ml-2 cursor-pointer"
                      onClick={() => handleToDoDelete(item._id)}
                    />
                  </div>
                </div>
              ))}
            {isCompletedScreen === true &&
              completedTodos.map((item, index) => (
                <div
                  className={`todo-list-item flex justify-between items-center rounded-xl ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  } p-2 rounded-lg mb-2 shadow-lg`}
                  key={index}
                >
                  <div>
                    <h3 className="text-green-500 font-bold">{item.text}</h3>
                    <p className="text-black  font-extralight">
                      Completed at:{" "}
                      {item.updatedAt
                        ? format(
                            new Date(item?.updatedAt),
                            "MMMM dd, yyyy • HH:mm"
                          )
                        : "Date not available"}
                    </p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon text-lg ml-2 cursor-pointer"
                      onClick={() => handleCompletedTodoDelete(item._id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
export default Todo;
