import React from "react";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Input,
  Typography,
} from "@mui/material";
import RightSideBar from "./RightSideBar";
import RighBarUser from "./RighBarUser";

const LeftSideBar = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-black text-white py-2"></div>

      <main className="container mx-auto px-4 bg-black">
        <section className="my-8">
          <div className="bg-[#751e9e] text-center relative  rounded-lg">
            <div className="absolute inset-0 flex flex-col items-center justify-center ">
              <h1 className="lg:text-5xl sm:text-sm font-serif text-black shadow-2xl">
                EXPLORE THE WORLD HERE
              </h1>
            </div>
            <svg viewBox="0 0 1440 250" className="block">
              <path
                fill="#51146d"
                fillOpacity="1"
                d="M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </section>

        <section className="flex pt-4">
          <aside className="w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
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
                <button className="w-full text-left text-white bg-gray-700 p-2 rounded-md focus:outline-none">
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

          <section className="flex-1 ml-4">
          <RightSideBar/>
          {/* <RighBarUser/> */}
          </section>

        </section>
      </main>
    </div>
  );
};

export default LeftSideBar;
