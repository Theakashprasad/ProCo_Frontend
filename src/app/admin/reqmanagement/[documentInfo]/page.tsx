"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type Props = {
  params: {
    documentInfo: string;
  };
};

interface User {
  fullname: string;
  achievements: string;
  email: string;
  _id: string;
  Profession: string;
  request: boolean;
  working: string;
  Linkedin: string;
  country: string;
  about: string;
  imageUrl: string;
}

const Page = ({ params }: Props) => {
  const router = useRouter(); 
  const email = decodeURIComponent(params.documentInfo as string);
  const [user, setUser] = useState<User | null>(null); // Initialize user state with null

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(`${BASE_URL}/api/pro/proDoc/${email}`);
        setUser(res.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchData();
  }, [email]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      <div className="p-8 bg-white flex-1 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-black">VERIFICATION</h1>
          </div>
          <form className="space-y-5">
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 lg:w-1/2">
              <div className="flex-1">
                <label
                  htmlFor="Name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.fullname}
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="profession"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Profession
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.Profession}
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10">
              <div className="flex-1">
                <label
                  htmlFor="working"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Working
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.working}
                  disabled
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="achievements"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Achievements
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.achievements}
                  disabled
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 lg:w-1/2">
              <div className="flex-1">
                <label
                  htmlFor="country"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Country
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.country}
                  disabled
                />
              </div>
            </div>
            <label
              htmlFor="country"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Document
            </label>
            <div className="flex items-center space-x-4">
              <Image
                src={user.imageUrl}
                alt="Profile Picture"
                width={50}
                height={50}
                className="w-36 cursor-pointer p-2 border border-black rounded-lg bg-white"
              />
              <a
                href={user.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
              >
                View Doc
              </a>
            </div>
            <div className="flex-1">
                <label
                  htmlFor="working"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Linkedin
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  value={user.Linkedin}
                  disabled
                />
              </div>
            <div>
              <label
                htmlFor="about"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                About
              </label>
              <input
                className="w-full h-36 p-2 border border-black rounded-lg bg-white"
                value={user.about}
                disabled
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                <MdOutlineKeyboardBackspace />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
