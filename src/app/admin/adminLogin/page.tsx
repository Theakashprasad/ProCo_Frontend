// const Adminlogin = () => {

//   return (
//     <>
//     {/* <Header/> */}
//      <div className="flex h-screen">

//       <div className="flex flex-col justify-center items-center w-1/2 bg-gray-100 p-8">
//         <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome Admin</h1>

//         {errorMessage && (
// 						<div className="text-red-500 mt-4">
// 							{errorMessage}
// 						</div>
// 					)}

//         <form className="w-full max-w-md" onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter your email"
//              onChange={handleChange}
//             />
//           </div>
//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter your password"
//               onChange={handleChange}
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full py-2 px-4 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-300"
//           >
//             Login
//           </button>
//         </form>

//       </div>

//       {/* Right side */}
//       <div className="w-1/2">
//         <img
//           src="https://c7.alamy.com/comp/2J0822G/the-admin-user-has-all-the-privileges-shot-of-the-login-page-of-a-website-all-design-on-this-image-is-created-from-scratch-by-yuri-arcurs-team-of-2J0822G.jpg"
//           alt="Login"
//           className="h-full w-full object-cover"
//         />
//       </div>
//     </div>
//     </>
//   )
// }

// export default Adminlogin

"use client";
import "./App.css"; // Import your custom CSS for keyframes and animations
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import Header from '@/components/admin/header';
const Adminlogin = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    console.log('sajdfjiks');
    
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3005/api/adminLogin",
        formData
      );
      console.log(res.data.success);

      if (res.data.success) {
        toast.success("LOFGIN IS VERIFIED", {
          position: "top-center",
        });
        router.push("/admin");
      } else {
        console.error("Login failed:", res.data.message);
        // setErrorMessage(Login failed: ${res.data.message});
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage(
            "Login failed. invaild Admin Credentials, Please try again later."
          );
        }
      }
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <section className="absolute w-screen h-screen flex justify-center items-center gap-[2px] flex-wrap overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-black via-green-500 to-black animate-animate"></div>
        {[...Array(144)].map((_, i) => (
          <span
            key={i}
            className="relative block w-[calc(6.25vw-2px)] h-[calc(6.25vw-2px)] bg-[#181818] z-[2] transition-[1.5s] hover:bg-green-500 hover:transition-[0s]"
          />
        ))}
        <div className="signin absolute w-[400px] bg-[#222] z-[1000] flex justify-center items-center p-10 rounded shadow-2xl">
          <div className="content relative w-full flex flex-col justify-center items-center gap-10">
            <h2 className="text-2xl text-green-500 uppercase font-extrabold">
              Sign In
            </h2>
            <div className="form w-full flex flex-col gap-6">
              <div className="inputBox relative w-full">
                <input
                  type="text"
                  required
                  placeholder="E-mail"
                  className="relative w-full bg-[#333] border-none outline-none p-[25px_10px_7.5px] rounded text-white font-medium text-[1em]"
                  onChange={handleChange}
                />
                
              </div>
              <div className="inputBox relative w-full">
                <input
                  type="password"
                  required
                  placeholder="password"
                  className="relative w-full bg-[#333] border-none outline-none p-[25px_10px_7.5px] rounded text-white font-medium text-[1em]"
                  onChange={handleChange}
                />
              
              </div>

              <div className="inputBox relative w-full">
                <input
                  type="submit"
                  value="Login"
                  className="p-2.5 bg-green-500 text-black font-semibold text-[1.35em] tracking-[0.05em] cursor-pointer active:opacity-60"
                  onClick={handleSubmit}
               />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Adminlogin;
