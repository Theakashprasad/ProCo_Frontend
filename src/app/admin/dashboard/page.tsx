"use client";
import { FaUser, FaUserGraduate, FaMoneyBillWave } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/Admin/AdminLayout";
import Component from "@/components/Admin/UserChar";
import axiosInstance from "@/lib/adminAxios";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import ProGraph from "@/components/Admin/ProChart";

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report: number;
  isBlocked: boolean;
  role: string;
  payment: boolean;
}

const UserManagement = () => {
  const [reload, setReload] = useState(false);
  const router = useRouter();
  const [adminPayment, setAdminPayment] = useState(0);
  const [ProPayment, setProPayment] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [proCount, setproCount] = useState(0);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const updatauser = async () => {
      const responses = await axiosInstance.get("/api/admin/getPayment");
      const res = await axios.get("http://localhost:3005/api/user");
      // this is for the amount admin and pro recived
      const value = responses.data.data.length;
      const total = value * 500; // Calculate the total (5 * 500)
      const admin = total * 0.1; // 10% of the total
      const pro = total * 0.9; // 90% of the total
      setAdminPayment(admin);
      setProPayment(pro);

      // this is for the count of user and pro
      const userCount = res.data.data.filter(
        (user: any) => user.role === "user"
      ).length;
      console.log("userCount", userCount);
      setUserCount(userCount);
      setproCount(res.data.data.length - userCount);

      setUsers(res.data.data);
    };
    updatauser();
    setReload(false);
  }, [
    reload,
    setProPayment,
    setAdminPayment,
    setUsers,
    setUserCount,
    setproCount,
  ]);

  const handlogout = () => {
    try {
      router.replace("/admin/adminLogin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdminLayout>
      <div className=" bg-black to-slate-600 text-black flex flex-col items-center w-full min-h-screen">
        <div className="flex space-x-10 py-10">
          {/* Customers Card */}
          <div className="bg-white  shadow-md rounded-xl p-4 w-full max-w-xs h-28  flex flex-col justify-around  ">
            <div className="border-l-4 border-l-blue-400 px-4">
              <div className="flex items-center justify-between ">
                <h4 className="text-xs font-medium text-gray-600">USERS</h4>
                <div className="rounded-full bg-gray-100 p-2 ">
                  <span className="icon-placeholder">
                    <FaUser />
                  </span>
                </div>
              </div>
              <div className="flex items-center  ">
                <h3 className="text-2xl font-bold">{userCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xs h-28  flex flex-col justify-around  ">
            <div className="border-l-4 border-l-blue-400 px-4">
              <div className="flex items-center justify-between ">
                <h4 className="text-xs font-medium text-gray-600">
                  PROFESSIONALS
                </h4>
                <div className="rounded-full bg-gray-100 p-2 ">
                  <span className="icon-placeholder">
                    <FaUserGraduate />
                  </span>
                </div>
              </div>
              <div className="flex items-center  ">
                <h3 className="text-2xl font-bold">{proCount}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xs h-28  flex flex-col justify-around  ">
            <div className="border-l-4 border-l-blue-400 px-4">
              <div className="flex items-center justify-between ">
                <h4 className="text-xs font-medium text-gray-600">
                  PROFESSIONAL PROFIT
                </h4>
                <div className="rounded-full bg-gray-100 p-2 ">
                  <span className="icon-placeholder">
                    <RiMoneyDollarCircleFill />
                  </span>
                </div>
              </div>
              <div className="flex items-center  ">
                <h3 className="text-2xl font-bold">{ProPayment}</h3>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-xl p-4 w-full max-w-xs h-28  flex flex-col justify-around  ">
            <div className="border-l-4 border-l-blue-400 px-4">
              <div className="flex items-center justify-between ">
                <h4 className="text-xs font-bold text-gray-600">
                  ADMIN PROFIT
                </h4>
                <div className="rounded-full bg-gray-100 p-2 ">
                  <span className="icon-placeholder">
                    <FaMoneyBillWave />
                  </span>
                </div>
              </div>
              <div className="flex items-center  ">
                <h3 className="text-2xl font-bold">{adminPayment}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full px-10">
          <div className="w-[70%]">
            <Component />
          </div>

          <div className="w-[70%]">
            <ProGraph />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
