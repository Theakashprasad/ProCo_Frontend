"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";


const Otp = () => {
  const router = useRouter()
  const [otp, setOtp] = useState("");
  const [timer, setTimer] =useState(60)
  let storedEmail 
  useEffect(() => {
    let interval: any;
    if (timer  > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timer]);
  let user = localStorage.getItem('userEmailFromSignUpPage');
  let pro = localStorage.getItem('userEmailFromForgetPage');
  storedEmail = user ? user : pro
  console.log(user, pro)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3005/api/otp", { otp, storedEmail});
  
      if (response.data.success) {
        toast.success("OTP IS VERIFIED", {
          position: "top-center",
        });
        if(user){
          localStorage.removeItem('userEmailFromSignUpPage'); // Remove the userEmail from localStorage
        router.replace("/login");

        }else{
          // localStorage.removeItem('userEmailFromForgetPage'); // Remove the userEmail from localStorage
          router.replace("/resetpassword");

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

  const resentHandeler =async (e:  React.MouseEvent<HTMLButtonElement>)=>{
     e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3005/api/resentOtp",{storedEmail});
console.log(response);

      if (response.data.success) {
       toast.success("OTP IS RESENT", {
         position: "top-center",
       });
      setTimer(100)
     } else {
       toast.error(response.data.message || "Verification failed", {
         position: "top-center",
       });
     }
    } catch (error) {
      console.log(error);
      
    }
  }

    return (
      <div className="bg-black flex items-center justify-center min-h-screen relative overflow-hidden">
        <div className="hidden md:block absolute top-[-4rem] left-[45rem] w-[20rem] h-[20rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
        <div className="hidden md:block absolute bottom-[-4rem] right-[4rem] w-[15rem] h-[15rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
        <div className="relative z-10  flex flex-col md:flex-row  items-center w-full max-w-screen-lg ml-14 md:px-0">
          <div className="md: md:w-1/2 text-center md:text-left mb-8 md:mr-40">
            <h1 className="text-6xl font-bold">No Steam.!!</h1>
          </div>
          <div className="md:w-1/3 bg-black text-white p-6 md:p-10 rounded-lg shadow-lg max-w-md h-[30rem] relative backdrop-blur-md bg-transparent border border-purple-600">
            <h2 className="text-2xl font-bold mb-4"> OTP Verification</h2>
            <p className="mb-4">Please enter your OTP </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  type="text"
                  id="username"
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="*****"
                />
              </div>
              <button
              className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-900 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-medium"
              type="submit"
              hidden={timer === 0} // Disable the button if timer is 0
            >
              Submit
            </button>
            </form>

            <button type="button" onClick={resentHandeler}>
              Resent
            </button>
            <span>

              <div className="flex justify-center pt-10  rounded-xl">
                <span className="text-white text-base  font-thin  ">
                  {timer == 0 ? 'Try resending the OTP' : timer}
                </span>
              </div>
     
            </span>
              <div className="mt-4 text-center absolute bottom-6 left-6 right-6 ">
                <Link href='/signup' className="text-sm text-purple-600 hover:underline">
                  Dont have an account? Signup
                </Link>
              </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Otp;
  