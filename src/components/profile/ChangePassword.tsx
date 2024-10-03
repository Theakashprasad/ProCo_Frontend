"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const ChangePassword = () => {
  const modalRefChangePs = useRef<HTMLDialogElement>(null);
  const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [userId, setUserId] = useState(initialUserState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [truePSmodel, setTruePSmodel] = useState(false)
  useEffect(() => {
    if (modalRefChangePs.current) {
      modalRefChangePs.current.showModal();
    }
  }, []);

  const handleSubmit = async () => {
    const response = await axios.post(
      `${BASE_URL}/api/checkPassword`,
      { email: userId.email, userId: userId._id, password },
      {
        withCredentials: true,
      }
    );
    console.log(response.data);
    if (!response.data.success) {
     toast.error("password does not match", {
        position: "top-center",
      });
    }else{
        setTruePSmodel(true)
    }
  };

  const handleConfirmSubmit = async () =>{
    console.log(confirmPassword, password);
    if( password != confirmPassword){
        toast.error("passwords does not match", {
            position: "top-center",
          });
    }else{
        const response = await axios.post(
            `${BASE_URL}/api/restPassword`,
            { password: password, storedEmail: userId.email},
            {
              withCredentials: true,
            }
          );
          if(response){
            toast.success("password has been changed", {
                position: "top-center",
              });
              if (modalRefChangePs.current) {
                modalRefChangePs.current.close();
              }
          }
          
    }

  }
  return (
    <div>
      <dialog id="my_modal_1" className="modal " ref={modalRefChangePs}>
        <div className="modal-box ">
          <h3 className="font-bold text-lg ">ENTER PASSWORD</h3>
          {
            truePSmodel? 
            <form>
            <div className="m-4">
              <input
                className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                type="text"
                id="username"
                placeholder="new password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="m-4">
              <input
                className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                type="text"
                id="username"
                placeholder="confirm password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className=" w-1/3 py-1 bg-gradient-to-r from-blue-500 to-purple-900 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-medium"
                type="button"
                onClick={handleConfirmSubmit}
              >
                Enter
              </button>
            </div>
          </form>
            :
             <form>
            <div className="m-4">
              <input
                className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                type="text"
                id="username"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button
                className=" w-1/3 py-1 bg-gradient-to-r from-blue-500 to-purple-900 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-medium"
                type="button"
                onClick={handleSubmit}
              >
                Enter
              </button>
            </div>
          </form>
          }
          
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ChangePassword;
