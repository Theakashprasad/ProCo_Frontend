"use client";
import "./App.css"; // Import your custom CSS for keyframes and animations
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Adminlogin = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3005/api/admin/adminLogin",
        formData,{withCredentials:true}
      );
      router.push("/admin/dashboard");
      if (res.data.success) {
        toast.success("LOGIN IS VERIFIED", {
          position: "top-center",
        });
      } else {
        setErrorMessage(`Login failed: ${res.data.message}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password.", {
            position: "top-center",
          });
        } else {
          setErrorMessage(
            "Login failed. Invalid Admin Credentials, Please try again later."
          );
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <section className="absolute w-screen h-screen flex justify-center items-center gap-[2px] flex-wrap overflow-hidden">
        <div className="absolute w-full h-full bg-gradient-to-b from-black via-purple-500 to-black animate-animate"></div>
        {[...Array(144)].map((_, i) => (
          <span
            key={i}
            className="relative block w-[calc(6.25vw-2px)] h-[calc(6.25vw-2px)] bg-[#181818] z-[2] transition-[1.5s] hover:bg-purple-500 hover:transition-[0s]"
          />
        ))}
        <div className="signin absolute w-[400px] bg-[#222] z-[1000] flex justify-center items-center p-10 rounded shadow-2xl">
          <div className="content relative w-full flex flex-col justify-center items-center gap-10">
            <h2 className="text-2xl text-white uppercase font-extrabold">
              Sign In
            </h2>
            <div className="form w-full flex flex-col gap-6">
              <div className="inputBox relative w-full">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-mail"
                  className="relative w-full bg-[#333] border-none outline-none p-[25px_10px_7.5px] rounded text-white font-medium text-[1em]"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="inputBox relative w-full">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  className="relative w-full bg-[#333] border-none outline-none p-[25px_10px_7.5px] rounded text-white font-medium text-[1em]"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              <div className="inputBox relative w-full">
                <input
                  type="submit"
                  value="Login"
                  className="p-2.5 bg-black font-semibold text-[1.35em] tracking-[0.05em] cursor-pointer active:opacity-60"
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
