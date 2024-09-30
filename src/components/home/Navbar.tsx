"use client";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useDataMain from "@/Hook/blockCheck";
import useStore from "@/store/user";
import useUser from "@/Hook/useUser";
import { CgProfile } from "react-icons/cg";

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report: number;
  isBlocked: boolean;
  role: string;
  payment: boolean;
  // Add more fields as needed
}

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { setPayment, premimum } = useStore();
  const { user } = useUser();
  const { userDatas } = useDataMain();
  const [userInfo, setUserInfo] = useState<User>();

  useEffect(() => {
    if (userDatas) {
      setUserInfo(userDatas);
    }
  }, [setUserInfo, userDatas, user]);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  const router = useRouter();

  const handleLogout = () => {
    // Remove the cookie
    // localStorage.clear();
    Cookies.remove("access_token"); // Replace 'authToken' with the name of your cookie
    // Redirect to login page or home page
    router.push("/login"); // Adjust the path as needed
  };
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b bg-[#0d0d0d] border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl font-serif tracking-tight font-extrabold pl-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
              ProCo .
            </span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            <li>
              <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
                HOME
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>
            </li>
            <li>
              <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
                CONTACT
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>
            </li>
            <li>
              <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
                ABOUT
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>
            </li>
            <li>
              <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
                <Link href="/category"> CATEGORY</Link>
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>
            </li>
          </ul>
          <div className="hidden lg:flex justify-center space-x-5 items-center">
            <div>
              {user?.role == "user" ? (
                <Link href="/user/profile">
                  <CgProfile className="w-10 h-10 " />
                </Link>
              ) : (
                <Link href="/profile">
                  <CgProfile className="w-10 h-10" />
                </Link>
              )}
            </div>
            <div>
            {!user?.isPro && !userInfo?.payment && !premimum && (
                <button
                  onClick={() => setPayment(true)}
                  type="submit"
                  className="text-yellow-600 underline"
                >
                  Premium
                </button>
              )}{" "}
            </div>
            <button
              onClick={handleLogout}
              className="relative -top-1 -left-1  bg-gray-800 py-2.5 px-5 font-medium uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0"
            >
              logout
            </button>
            {/* <button className="relative -top-1 -left-1  bg-gray-800 py-2.5 px-5 font-medium uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0">
            <Link href="/signup">
              Sign In
              </Link>
            </button>
            <button className="relative -top-1 -left-1 bg-gray-800 py-2.5 px-5 font-medium uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0">
              <Link href="/signup">
              Sign Up
              </Link>
            </button> */}
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              <li>
                <a>HOME</a>
              </li>
              <li>
                <a>CONTACT</a>
              </li>
              <li>
                <a>ABOUT</a>
              </li>
              <li>
                <a>CATEGORY</a>
              </li>
            </ul>
            <div className="flex space-x-6">
              <a href="#" className="py-2 px-3 border rounded-md">
                Sign In
              </a>
              <a
                href="#"
                className="py-2 px-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-800"
              >
                Create an account
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
