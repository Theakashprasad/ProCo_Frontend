"use client";
import Image from "next/image";
import { signIn } from "next-auth/react";


export default function SignInBtn() {
  const handleGoogle = () => {
    try {
       signIn("google");
    } catch (error) {
      console.error("An error occurred during sign-in:", error);
    }
  };
  return (
    <>
    <button
      onClick={handleGoogle}
      className="flex items-center gap-4 shadow-xl rounded-lg pl-3"
    >
      <Image
        src="https://procowebsite.s3.eu-north-1.amazonaws.com/google-logo.png"
        width={35}  
        height={10}
        layout="fixed" 
        alt="Google logo"
      />    
    </button>
    </>
  );
}
