"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

//Ths is used as a base url for the backed req
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter value", {
        position: "top-left",
      });
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/api/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success("LOGIN IS VERIFIED", {
          position: "top-center",
        });
        if (response.data.data.role == "user") {          
          localStorage.setItem("jwtToken", JSON.stringify(response.data.token));
          localStorage.setItem(
            "userDetail",
            JSON.stringify(response.data.data)
          );
          // router.replace("/");
        } else {
          localStorage.setItem("ProEmail", response.data.data.email);
          localStorage.removeItem("userEmailFromForgetPage"); // Remove the userEmail from localStorage
          const email = response.data.data.email;
          const data = await axios.post(`${BASE_URL}/api/pro/emailCheck`, {
            email: email,
          });
          if (data.data.success) {
            console.log(data.data.data.request);
            if (data.data.data.request) {
              localStorage.setItem(
                "userDetail",
                JSON.stringify(response.data.data)
              );
              router.replace("/");
            } else {
              router.replace("/standBy");
            }
          } else {
            router.replace("/pro-verify");
          }
        }
      } else {
        toast.error(response.data.message || "Verification failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data.message ||
            "An error occurred. Please try again.",
          {
            position: "top-left",
          }
        );
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="bg-black flex items-center justify-center min-h-screen relative overflow-hidden">
      <div className="absolute top-4 left-4">
        <span className="text-xl font-serif tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
          ProCo .
        </span>
      </div>
      <div className="hidden md:block absolute top-[-4rem] left-[45rem] w-[20rem] h-[20rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
      <div className="hidden md:block absolute bottom-[-4rem] right-[4rem] w-[15rem] h-[15rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
      <div className="relative z-10  flex flex-col md:flex-row  items-center w-full mr-8 max-w-screen-lg ml-14 md:px-0">
        <div className="md: md:w-1/2 text-center md:text-left mb-8 md:mr-40">
          <h1 className="text-6xl font-bold">Welcome Back .!</h1>
        </div>
        <div className="md:w-1/3 bg-black text-white p-6 md:p-10 rounded-lg shadow-lg max-w-md relative backdrop-blur-md bg-transparent border border-purple-600">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <p className="mb-4">Glad youre back!</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                id="username"
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <input
                className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="relative w-full py-2 bg-gradient-to-r from-blue-500 to-purple-900  hover:from-purple-300 hover:to-blue-700 hover:text-black before:absolute before:-inset-1 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:blur-3xl before:opacity-0 hover:before:opacity-100 rounded-lg text-white font-medium"
              type="submit"
            >
              Login
            </button>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-purple-600 hover:underline">
                <Link href="/forgetpassword">Forgot password?</Link>
              </span>
            </div>
            {/* <div className="mt-4 flex justify-center">
              <a className="mx-2 flex items-center" href="#">
                <img
                  className="h-12 w-12 object-contain"
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google"
                />
              </a>
              <a className="mx-2 flex items-center" href="#">
                <img
                  className="h-12 w-12 object-contain"
                  src="https://img.icons8.com/color/48/000000/facebook-new.png"
                  alt="Facebook"
                />
              </a>
              <a className="mx-2 flex items-center" href="#">
                <img
                  className="h-12 w-12 object-contain"
                  src="https://img.icons8.com/nolan/64/github.png"
                  alt="GitHub"
                />
              </a>
            </div> */}

            <div className="mt-4 text-center">
              <span className="text-sm  hover:underline">
                Dont have an account?
                <Link href="/signup">Signup</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
