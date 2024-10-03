"use client";
import axiosInstance from "@/lib/axios";
import useStore from "@/store/user";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ImCross } from "react-icons/im";

type props = {
  userId: string;
};

const Room = ({ userId }: props) => {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();
  const { setCommunityId } = useStore();
  const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const [groupCode, setGroupCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const proUserData = await axiosInstance.get(
        `/api/pro/CommunityUser/${userId}`
      );
      const data = proUserData.data.data;
      if (data) {
        setGroupCode(data.groupCode);
      }
    };
    fetchData();
  }, [userId]);

  const handleSubmit = async (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    setCommunityId(userId);
    const data = {
      groupCode: roomCode,
      communityId: userId,
    };
    try {
      const proUserData = await axiosInstance.post("/api/pro/groupCode", data);
      router.push(`/Room/${encodeURIComponent(roomCode)}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitUser = async (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    if (groupCode) router.push(`/Room/${encodeURIComponent(groupCode)}`);
  };

  
  const handleCancle = async () => {
    const data = {
      groupCode: null,
      communityId: userId,
    };
    console.log(data);

    try {
      if (user.role == "profesional") {
        const proUserData = await axiosInstance.post(
          "/api/pro/groupCode",
          data
        );
      }
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-[100%] h-screen bg-[#0d0d0d] ">
      {user.role == "profesional" ? (
        <form
          onSubmit={handleSubmit}
          className=" p-6 rounded shadow-md w-80 border border-gray-600"
        >
          <button
            type="submit"
            onClick={handleCancle}
            className="absolute top-4 right-9 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-700"
          >
            <ImCross />
          </button>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter Room code
            </label>
            <input
              type="text"
              required
              placeholder="Enter Room code"
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Enter Room
          </button>
        </form>
      ) : groupCode == null ? (
        <form className=" p-6 rounded shadow-md w-80 border border-gray-600">
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              ROOM HAS NOT BEEN CREATED
            </label>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSubmitUser}
          className=" p-6 rounded shadow-md w-80 border border-gray-600"
        >
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">
              ROOM HAS BEEN CREATED PLEASE JOIN
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Enter Room
          </button>
        </form>
      )}
    </div>
  );
};

export default Room;
