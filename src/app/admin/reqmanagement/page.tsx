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
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { Input } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "@/components/Admin/AdminLayout";

interface User {
  achievements: string;
  email: string;
  _id: string;
  fullname: string;
  Profession: string;
  request: boolean;
}

const ReqManagement = () => {
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const updatauser = async () => {
      const res = await axios.get("http://localhost:3005/api/pro/user");
      // console.log("val", res);
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

  const handleAction = async (userId: string, value: string) => {
    try {
      console.log("valu", value);
      if (value == "accept") {
        const action = true;
        const res = await axios.post(
          `http://localhost:3005/api/pro/verifyDoc/${userId}/${action}`
        );
        toast.success("user has been verified", {
          position: "top-center",
        });
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === userId ? { ...user, request: true } : user
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-black text-white flex flex-col items-center w-full h-screen overflow-hidden">
        <div className="w-full h-full">
          <div className="p-6 px-36">
            <h1 className="text-2xl font-semibold p-4 text-white underline">
              REQUEST MANAGEMENT
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
                  <th className="px-6 py-4">DOCUMENTS</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((data) => data.email.includes(searchQuery))
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className="text-white border-b border-b-white text-sm"
                    >
                      {" "}
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{user.fullname}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4 text-blue-400 hover:text-blue-800">
                        <Link
                          href={`/admin/reqmanagement/${encodeURIComponent(
                            user.email
                          )}`}
                        >
                          VIEW
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        {user.request ? (
                          <span className="bg-green-400 text-black rounded-2xl p-1 px-5">
                            accept
                          </span>
                        ) : (
                          <select
                            className="bg-white text-black rounded-2xl p-1"
                            onChange={(e) =>
                              handleAction(user.email, e.target.value)
                            }
                          >
                            <option value="pending">pending</option>
                            <option value="accept">accept</option>
                            <option value="reject">reject</option>
                          </select>
                        )}
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

export default ReqManagement;
