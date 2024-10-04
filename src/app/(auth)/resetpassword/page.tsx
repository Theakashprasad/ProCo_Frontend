'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const Restpassword = () => {
   const [password, setPassword] =  useState('')
   const [storedEmail, setStoredEmail] = useState('');
   const router = useRouter()
   
   useEffect(() => {
    const email = localStorage.getItem('userEmailFromForgetPage');
    if (email) {
      setStoredEmail(email);
    }
  }, []);
   const handleSubmit =async (e:  React.MouseEvent<HTMLButtonElement>)=>{
     console.log(storedEmail);
     
  try {
    const response = await axios.post(`${BASE_URL}/api/restPassword`,{password, storedEmail} );

    if (response.data) {
      toast.success("PASSWORD RESETED", {
        position: "top-center",
      });
      
      router.replace("/login");
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
}
    return (
      <div className="bg-black flex items-center justify-center min-h-screen relative overflow-hidden">
        <div className="hidden md:block absolute top-[-4rem] left-[45rem] w-[20rem] h-[20rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
        <div className="hidden md:block absolute bottom-[-4rem] right-[4rem] w-[15rem] h-[15rem] bg-gradient-to-br from-purple-600 to-black rounded-full opacity-50"></div>
        <div className="relative z-10  flex flex-col md:flex-row  items-center w-full max-w-screen-lg ml-14 md:px-0">
          <div className="md: md:w-1/2 text-center md:text-left mb-8 md:mr-40">
            <h1 className="text-6xl font-bold">we are here ..!</h1>
          </div>
          <div className="md:w-1/3 bg-black text-white p-6 md:p-10 rounded-lg shadow-lg max-w-md h-[30rem] relative backdrop-blur-md bg-transparent border border-purple-600">
            <h2 className="text-2xl font-bold mb-4">Reset Password ?</h2>
            <p className="mb-4">Please enter you’re new password</p>
            <form>
              <div className="mb-4">
                <input
                  className="w-full px-3 py-2 border border-y-fuchsia-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  type="text"
                  id="username"
                  placeholder="******"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-900 hover:from-purple-700 hover:to-purple-800 rounded-lg text-white font-medium"
                type="button"
                onClick={handleSubmit}
              >
                Reset Password
                
              </button>
  
              <div className="mt-4 text-center absolute bottom-6 left-6 right-6 ">
                <a className="text-sm text-purple-600 hover:underline" href="#">
                  Dont have an account? Signup
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Restpassword;
  