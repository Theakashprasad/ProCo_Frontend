"use client";

import { useSocketStore } from "@/store/socketStore";
import { useEffect } from "react";
import { MdCall, MdCallEnd } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";

const CallNotification = () => {
  const { ongoingCall, handleJoinCall, handleHangupDuringInitiation } =
    useSocketStore();
  useEffect(() => {}, [ongoingCall]);

  if (!ongoingCall?.isRinging) return null;
  console.log("incoming call notification", ongoingCall);
  return (
    <div className="absolute bg-opacity-70 w-screen h-screen top-0 bottom-0 flex items-center justify-center text-black">
      <div className="bg-[#1b1b1b] min-w-[400px] min-h-[100px] flex flex-col items-center justify-center rounded-xl p-4">
        <div className="flex flex-col items-center">
          <FaRegCircleUser className="text-9xl text-white" />

          <h3 className="text-2xl font-extrabold text-white uppercase">
            {ongoingCall.participants.caller.fullname}
          </h3>
        </div>
        <p className="text-sm font-extralight mb-2 text-white">
          IS NOW CALLING...
        </p>
        <div className="flex gap-8">
          <button
            onClick={() => handleJoinCall(ongoingCall)}
            className="w-10 h-10 bg-white rounded-full hover:bg-green-400 flex items-center justify-center text-white"
          >
            <MdCall size={24} className="text-black" />
          </button>
          <button
            onClick={handleHangupDuringInitiation}
            className="w-10 h-10 bg-rose-500 rounded-full hover:bg-red-400 flex items-center justify-center text-white"
          >
            <MdCallEnd size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallNotification;
