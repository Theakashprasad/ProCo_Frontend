"use client";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaEnvelope,
  FaImage,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { Input } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report:number;
  isBlocked:boolean;
  // Add more fields as needed
}

const UserManagement = () => {
  
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // console.log('sdsdsd',users[0]);

  useEffect(() => {
    const updatauser = async () => {
      const res = await axios.post("http://localhost:3005/api/user");
      setUsers(res.data.data);
    };
    updatauser();
    setReload(false);
  }, [reload]);
  const handlogout = () => {
    try {
      // await fetch("/api/auth/signout");
        router.replace("/admin/adminLogin");
      } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (userId: string, isBlocked: boolean) => {
    try {
      const action = isBlocked ? 'unblock' : 'block';
      const res = await axios.post(`http://localhost:3005/api/block/${userId}/${action}`);
      console.log(action,typeof userId);
      toast.error( `user has been ${action}`, {  
        position: "top-center",
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    }  catch (error) {
      console.log(error);
      
      // console.error(${isBlocked ? 'Unblock' : 'Block'} action failed for user ${userId}:, error);
    }
  }

  return (
<div className=" bg-gradient-to-br from-[#9a9898] via-[#656565] to-slate-600 text-black flex flex-col items-center w-full min-h-screen">
<div className="w-full h-full">
        <header className="p-2 bg-[#646464] flex justify-between items-center">
        <div className="flex items-center flex-shrink-0">
            <Image
              className="h-10 w-10 mr-2"
              src="https://static.vecteezy.com/system/resources/thumbnails/008/124/712/small_2x/initial-letter-p-with-a-swoosh-logo-template-modern-logotype-for-business-and-company-identity-free-vector.jpg"
              alt="Logo"
              width={500}
              height={500}
            />
            <span className="text-xl tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
              ProCo
            </span>
          </div>
          <nav className="flex justify-around items-center p-6 w-[45rem]">
            <FaHome className="text-white text-4xl cursor-pointer" />
            <FaUser className="text-white text-4xl cursor-pointer" />
            <FaUsers className="text-white text-4xl cursor-pointer" />
            <FaEnvelope className="text-white text-4xl cursor-pointer" />
            <FaImage className="text-white text-4xl cursor-pointer" />
          </nav>
          <div className="flex justify-end" onClick={handlogout}>
        <MdLogout size="24px" />{" "}
      </div>
        </header>

        <div className="p-6 px-36">
          <h1 className="text-2xl font-semibold p-4 text-white underline">USER MANAGEMENT</h1>
          <div className="mb-6">
            <Input
              placeholder="Search..."
              value={searchQuery}

              onChange={(e) => setSearchQuery(e.target.value)}

              className="w-half text-purple-700"
            />
          </div>
          <table className="w-full text-left table-auto text-lg ">
            <thead>
              <tr className=" bg-neutral-600 text-white">
                <th className="px-6 py-4">SL NO</th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">E-MAIL</th>
                <th className="px-6 py-4">REPORT</th>
                <th className="px-6 py-4">STATUS</th>
              </tr>
            </thead>
            <tbody>
            {users.filter((data) => data.email.includes(searchQuery)).map((user,index) => (
                <tr key={user._id} className="text-white">
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{user.fullname}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.report}</td>
                  <td className="px-6 py-4">
                  <button
                  onClick={() => handleAction(user._id, user.isBlocked)}
                  className={`bg-${user.isBlocked ? 'green' : 'blue'}-500 text-black font-bold py-2 px-4 w-36 rounded-lg`}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className=" absolute bottom-0 left-0 right-0 flex items-center justify-center">
          <span className="text-lg">1 / 4</span>
            <button className="text-lg px-6 py-3 rounded">
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
