"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "@/lib/axios";

interface ILanguage {
  _id: string;
  languageName: string;
}

interface ICategory {
  _id: string;
  categoryName: string;
}

interface IQuizOption {
  option: string;
  isCorrect: boolean;
}

interface IQuizQuestion {
  question: string;
  options: IQuizOption[];
  correctAnswer: string;
}
type props = {
    userId: string;
  };
  
const AddQuizz = ({ userId }: props) => {
  const [name, setName] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [questions, setQuestions] = useState<IQuizQuestion[]>([]);

  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: [{ option: "" }, { option: "" }, { option: "" }, { option: "" }],
    correctAnswer: "",
  });
  const router = useRouter();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewQuestion({
      question: "",
      options: [{ option: "" }, { option: "" }, { option: "" }, { option: "" }],
      correctAnswer: "",
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuestion({ ...newQuestion, question: e.target.value });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = { option: e.target.value };
    setNewQuestion({ ...newQuestion, options: newOptions });
    // console.log(newQuestion.options)
    // console.log(questions,'ques')
  };

  const handleCorrectAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewQuestion({ ...newQuestion, correctAnswer: e.target.value });
  };

  const isQuestionValid = () => {
    return (
      newQuestion.question.trim() !== "" &&
      newQuestion.options.every((opt) => opt.option.trim() !== "") &&
      newQuestion.correctAnswer.trim() !== ""
    );
  };

  const handleSubmit = () => {
    if (isQuestionValid()) {
      setQuestions([...(questions as any), newQuestion]);
      handleCloseModal();
    }
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleAddQuiz = async () => {
    try {
      console.log("handleAddQuiz");
      const response = await axiosInstance.post("/api/pro/addQuizz",{name, questions, communityId:userId});
      if (response.status === 201) {
        toast("Quiz created successfully");
        router.push("/admin/quizManagement");
      } else {
        console.log("already");
        toast("Quiz already exists");
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="min-h-screen p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Add New Quiz</h1>
          <button
            onClick={() => router.push("/admin/quizManagement")}
            className="bg-transparent border border-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            Go back
          </button>
        </div>

        <div className="flex-grow flex justify-center items-start">
          <div className="bg-transparent border border-gray-500 p-6 rounded-lg shadow-md w-full max-w-md">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Enter quiz name"
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md bg-transparent border-gray-300"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleOpenModal}
                className="bg-transparent border border-gray-700 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex-grow"
              >
                Add Question +
              </button>

              <button
                onClick={handleAddQuiz}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors flex-grow"
                disabled={questions.length === 0}
              >
                Add Quiz
              </button>
            </div>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Questions Added ({questions.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {questions.map((ques, index) => (
                <div
                  key={index}
                  className="bg-white p-3 border rounded-md shadow-sm"
                >
                  <h3 className="font-semibold truncate">{ques.question}</h3>
                  <button
                    onClick={() => handleDelete(index)}
                    className="mt-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex justify-center items-center z-50">
          <div className="bg-transparent border border-gray-300 p-6 rounded-lg w-full max-w-md text-white">
            <h2 className="text-xl font-bold mb-4">Add new question</h2>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Question</label>
              <input
                type="text"
                value={newQuestion.question}
                onChange={handleQuestionChange}
                className="border w-full p-2 rounded-md bg-transparent border-gray-700"
              />
            </div>
            {newQuestion.options.map((opt, index) => (
              <div key={index} className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Option {index + 1}
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={opt.option}
                    onChange={(e) => handleInputChange(e, index)}
                    className="border flex-grow p-2 rounded-md bg-transparent border-gray-700"
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={opt.option}
                    checked={newQuestion.correctAnswer === opt.option}
                    onChange={handleCorrectAnswerChange}
                    className="h-4 w-4 bg-transparent border-gray-700"
                  />
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                disabled={!isQuestionValid()}
              >
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default AddQuizz;
