"use client";
import { signUpSchema } from "@/Types/Schema";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import animationData from "../../../assets/Professional.json";
import Lottie from "lottie-react";

//Ths is used as a base url for the backed req
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const Signup = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [role, setRole] = useState("user");

  const toggle = () => {
    setIsOn(!isOn);
    setRole((prevState) => (prevState == "user" ? "profesional" : "user"));
    localStorage.setItem("role", role == "user" ? "profesional" : "user");
    const promise = () =>
      new Promise((resolve) => setTimeout(() => resolve(role), 2000));

    toast.promise(promise(), {
      loading: "Loading...",
      success: (role) =>
        `NOW YOUR ARE A ${role == "user" ? "PROFESSIONAL" : "USER"}`,
      error: "Error",
      position: "top-center",
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error && error.message) {
          toast.error(error.message, { position: "top-left" });
        }
      });
    }
  }, [errors]);

  async function submitData(data: z.infer<typeof signUpSchema>) {
    // setUsername(data.email);
    const dataWithRole = { ...data, role };
    localStorage.setItem("userEmailFromSignUpPage", data.email);

    try {
      const response = await axios.post(`${BASE_URL}/api/signup`, dataWithRole);
      console.log(response);

      if (response) {
        toast.success("Verificaiton Mail Send to your email", {
          position: "top-center",
        });
        console.log("sdsd");

        router.replace("/otp");
      }
    } catch (error) {
      toast.success("Alread a user", {
        position: "top-center",
      });
    }
    console.log("IT WORKED", data);
  }
  return (
    <div className="bg-black  flex items-center justify-center min-h-screen relative overflow-hidden">
          <div className="absolute top-4 left-4">
        <span className="text-xl font-serif tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
          ProCo .
        </span>
      </div>
      <div className="absolute top-4 right-4">
        <div className="relative inline-block ">
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-white text-black font-bold w-6 h-6 rounded-full flex items-center justify-center"
          >
            i
          </button>
          {isHovered && (
            <div className="absolute top-0 right-full mr-2 p-2 w-96 bg-white text-black text-sm font-medium rounded shadow-lg z-10">
              This is a {role} signup page, If your planing on to be a {role}{" "}
              please verfy
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block absolute top-[-4rem] left-[45rem] w-[20rem] h-[20rem] bg-gradient-to-br from-pink-600 to-black rounded-full opacity-50"></div>
      <div className="hidden  md:block absolute bottom-[-4rem] right-[4rem] w-[15rem] h-[15rem] bg-gradient-to-br from-pink-600 to-black rounded-full opacity-50"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center w-full mr-8 max-w-screen-lg ml-14 md:px-0">
        <div className="md: md:w-1/2 text-center md:text-left mb-8 md:mr-40">
          <h1 className="text-6xl font-bold">Roll the Carpet.!</h1>
          {role == 'profesional' && <Lottie animationData={animationData} className="bg-gray-400 ml-32 mt-10 w-52 h-52"/>}   
        </div>
        
        <div className="md:w-1/3 bg-black text-white p-6 md:p-10 rounded-lg shadow-lg max-w-md relative backdrop-blur-md bg-transparent border border-purple-600">
          <h2 className="text-2xl font-bold mb-4">SignUp</h2>
          <p className="mb-4">Just some details to get you in.!</p>
          <form onSubmit={handleSubmit(submitData)}>
            <div className="mb-4">
              <input
                className={`w-full px-3 py-2 border ${
                  errors.fullname
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : "border-y-fuchsia-50"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="text"
                placeholder="Full Name"
                {...register("fullname")}
              />
            </div>
            <div className="mb-4">
              <input
                className={`w-full px-3 py-2 border ${
                  errors.email
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : "border-y-fuchsia-50"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="text"
                placeholder="Email"
                {...register("email")}
              />
            </div>
            <div className="mb-4">
              <input
                className={`w-full px-3 py-2 border ${
                  errors.password
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : "border-y-fuchsia-50"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="password"
                placeholder="Password"
                {...register("password")}
              />
            </div>
            <div className="mb-4">
              <input
                className={`w-full px-3 py-2 border ${
                  errors.confirmPassword
                    ? "focus-visible:ring-red-500 outline outline-red-500"
                    : "border-y-fuchsia-50"
                } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600`}
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
            </div>
            <button
              className="relative w-full py-2 bg-gradient-to-r from-blue-500 to-purple-900  hover:from-purple-300 hover:to-blue-700 hover:text-black before:absolute before:-inset-1 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:blur-3xl before:opacity-0 hover:before:opacity-100 rounded-lg text-white font-medium"
              type="submit"
            >
              Sign up
            </button>
            <div className="mt-4 text-center">
              <span className="text-sm text-white hover:underline">
                Already have an account?{" "}
                <Link href="/login">
                  <p className="text-sm text-purple-600 hover:underline">
                    Login
                  </p>
                </Link>
              </span>
            </div>
          </form>
      
        </div>
      </div>
      <div className=" absolute bottom-[4rem] right-[27rem] transform translate-x-12">
        <div className="relative inline-block ">
          <button
            onClick={toggle}
            className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isOn ? "bg-blue-500" : "bg-purple-500"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                isOn ? "translate-x-6" : ""
              }`}
            >
              {" "}
              {isOn ? "p" : "u"}{" "}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
