"use client";
import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../assets/Animation - 1720693731101.json";

const page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600">
      <div className="text-center">
        <div className="w-40 mx-auto">
          <Lottie animationData={animationData} />
        </div>
        <div>
          <h1 className="text-white ">A MAIL WILL BE SENT TO YOU ONCES THE DOCUMENT IS BEEN  VERIFIED, <br/> UNTIL THEN PLEASE STAND BY</h1>
        </div>
      </div>
    </div>
  );
};

export default page;
