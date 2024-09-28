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
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Cookies from "js-cookie";
import AdminLayout from "@/components/Admin/AdminLayout";
import adminProtectedRoute from "@/app/adminProtectedRoute";
import Swal from "sweetalert2";

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report: number;
  isBlocked: boolean;
  role: string;
  // Add more fields as needed
}
const userManagement = function UserManagement() {
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const updatauser = async () => {
      const res = await axios.get("http://localhost:3005/api/user", {
        withCredentials: true,
      });
      setUsers(res.data.data);
    };
    updatauser();
    setReload(false);
  }, [reload]);
  const handlogout = () => {
    try {
      router.replace("/admin/adminLogin");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (userId: string, isBlocked: boolean) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "save",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const action = isBlocked ? "unblock" : "block";
          const res = await axios.patch(
            `http://localhost:3005/api/block/${userId}/${action}`
          );
          console.log(action, typeof userId);
          toast.error(`user has been ${action}`, {
            position: "top-center",
          });
          Cookies.remove("access_token"); // Replace 'authToken' with the name of your cookie
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === userId ? { ...user, isBlocked: !isBlocked } : user
            )
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-black text-white flex flex-col items-center w-full h-screen overflow-hidden">
        <div className="w-full h-full">
          <div className="p-6 px-36">
            <h1 className="text-lg font-semibold py-4  text-white underline">
              USER MANAGEMENT
            </h1>
            <div className="mb-6">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-half text-white"
              />
            </div>
            <table className="w-full text-left table-auto text-lg ">
              <thead>
                <tr className=" bg-gray-800 text-white text-base">
                  <th className="px-6 py-4">SL NO</th>
                  <th className="px-6 py-4">NAME</th>
                  <th className="px-6 py-4">E-MAIL</th>
                  <th className="px-6 py-4">REPORT</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(
                    (data) =>
                      data.isVerified == true &&
                      data.role == "user" &&
                      data.email.includes(searchQuery)
                  )
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className="text-white border-b border-b-white text-sm"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{user.fullname}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.report}</td>
                      <td className="px-6 py-4 ">
                        <button
                          onClick={() => handleAction(user._id, user.isBlocked)}
                          className={`${
                            user.isBlocked ? "bg-blue-500" : "bg-green-500"
                          } text-black font-bold py-2 px-4 w-24 rounded-lg flex justify-center`}
                        >
                          {user.isBlocked ? <FaLock /> : <FaUnlock />}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className=" absolute bottom-0 left-0 right-0 flex items-center justify-center">
              <span className="text-lg">1 / 4</span>
              <button className="text-lg px-6 py-3 rounded">NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default adminProtectedRoute(userManagement);
