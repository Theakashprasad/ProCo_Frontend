"use client";
import React, { useState } from "react";
import { Typography } from "@mui/material";
import RightSideBar from "./RightSideBar";
import RighBarUser from "./RighBarUser";
import Community from "./Community";
import GroupChat from "./Question";
import Payment from "../Razorpay/payment";
import { GoFileMedia } from "react-icons/go";
import { FaUsers } from "react-icons/fa6";
import Link from "next/link";
import { IoPeopleSharp } from "react-icons/io5";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import withProtectedRoute from "@/app/protectedRoute";

const LeftSideBar = () => {
  const [isClicked, setIsClicked] = useState(1);
  const renderPage = () => {
    switch (isClicked) {
      case 1:
        return <RightSideBar />;
      case 2:
        return <RighBarUser />;
      case 3:
        return <Community />;
      default:
        return <RightSideBar />;
    }
  };
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black text-white py-2"></div>
      <main className="container mx-auto px-4 bg-black">
        <section className="flex pt-4">
          <aside className="w-1/4 bg-[#0d0d0d] p-4 rounded-lg shadow-lg">
            <div className="space-y-3 mb-10 text-sm">
              <button
                onClick={() => setIsClicked(1)}
                className={`w-full text-left text-white bg-[#1b1b1b] p-2 rounded-md flex justify-between items-center relative overflow-hidden group  ${
                  isClicked === 1
                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                    : "bg-[#1b1b1b]"
                }`}
              >
                <span className="relative z-10">MEDIA</span>
                <GoFileMedia className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => setIsClicked(2)}
                className={`w-full text-left text-white bg-[#1b1b1b] p-2 rounded-md flex justify-between items-center relative overflow-hidden group  ${
                  isClicked === 2
                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                    : "bg-[#1b1b1b]"
                }`}
              >
                <span className="relative z-10">PROFESIONALS</span>
                <FaUsers className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            
              <button
                onClick={() => setIsClicked(3)}
                className={`w-full text-left text-white bg-[#1b1b1b] p-2 rounded-md flex justify-between items-center relative overflow-hidden group  ${
                  isClicked === 3
                    ? "bg-gradient-to-r from-purple-600 to-blue-500"
                    : "bg-[#1b1b1b]"
                }`}
              >
                <span className="relative z-10">COMMUNITY</span>
                <GoFileMedia className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button className="w-full text-left text-white bg-[#1b1b1b] p-2 rounded-md flex justify-between items-center relative overflow-hidden group ">
                <span className="relative z-10">
                  {" "}
                  <Link href="/connect/a"> CHAT</Link>
                </span>
                <IoChatboxEllipsesOutline className="relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            {/* RAZORPAY PAYMENT METHOD */}
            <div className="relative group w-min">
              <Typography
                variant="h6"
                className="text-white mb-4 font-semibold cursor-pointer"
              >
                INFORMATIONS
              </Typography>
              <div className="absolute top-0 left-32 hidden group-hover:block bg-gray-700 text-white p-2 rounded-md shadow-xl w-64 text-center  z-50">
                <p className="font-mono text-pretty text-sm">
                  This is the educational qualification about the professions we
                  offer on this website..!
                </p>
              </div>
            </div>
            <ul className="space-y-2">
              <li className="relative group">
                <button className="w-full text-left text-white  p-2 rounded-md focus:outline-none hover:bg-gray-700">
                  BTECH
                </button>
                <ul className="absolute left-0 mt-2 hidden group-hover:block bg-gray-700 rounded-md shadow-lg w-full">
                  <li className="p-2 hover:bg-gray-600">EEE</li>
                  <li className="p-2 hover:bg-gray-600">Civil</li>
                  <li className="p-2 hover:bg-gray-600">MECH</li>
                </ul>
              </li>
              <li className="text-white p-2 rounded-md hover:bg-gray-700">
                MBBS
              </li>
              <li className="text-white p-2 rounded-md hover:bg-gray-700">
                MCOM
              </li>
              <li className="text-white p-2 rounded-md hover:bg-gray-700">
                M-TECH
              </li>
            </ul>
          </aside>

          <section className="flex-1 ml-4 ">
            {/* {isClicked ? <RighBarUser /> : <RightSideBar />} */}
            {renderPage()}
          </section>
        </section>
      </main>
    </div>
  );
};

export default LeftSideBar;
