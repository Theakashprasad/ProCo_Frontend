"use client";
import axiosInstance from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { FaUsers, FaHistory, FaWallet } from "react-icons/fa";

// Define types for wallet data and user history
interface WalletData {
  numberOfUsers: number;
  amount: number;
  createdAt: string;
}

interface UserHistory {
  users: any;
  userId: {
    fullname: string;
  };
  date: string;
}

const Wallet = () => {
  // Get user details from local storage
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [usersData, setUsersData] = useState(initialUserState);
  const [totalAmount, setTotalAmount] = useState(0);
  const [walletData, setWalletData] = useState<WalletData[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [numOfUsers, setNumOfUsers] = useState<UserHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (usersData && usersData._id) {
        try {
          const response = await axiosInstance.get(
            `/api/pro/getWallet/${usersData._id}`
          );

          const res = await axiosInstance.get(
            `/api/pro/getProPaymentt/${usersData._id}`
          );
          console.log("Payment data:", res.data.data);

          // Update wallet data and number of users
          setWalletData(response.data.data);
          setNumOfUsers(res.data.data);

          // Calculate the total amount
          const totalAmount = response.data.data.reduce(
            (total: number, payment: WalletData) => total + payment.amount,
            0
          );
          setTotalAmount(totalAmount);
        } catch (error) {
          console.error("Error fetching wallet data:", error);
        }
      }
    };
    fetchData();
  }, [usersData, setNumOfUsers]);

  // Function to format date in 'DD-MM-YYYY' format
  const formatDate = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-3/4 ml-8">
      <div className="bg-[#0d0d0d] p-8 rounded-lg min-h-screen">
        <div className="w-full min-h-screen mx-auto bg-[#1b1b1b] rounded-xl shadow-lg overflow-hidden text-gray-100">
          <div className="p-6">
            <div className="flex justify-center items-center bg-gradient-to-br py-6 to-gray-900">
              <div className="bg-black bg-opacity-80 w-full max-w-md rounded-2xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
                      Total Balance
                    </h2>
                    <FaWallet className="text-cyan-400 h-6 w-6" />
                  </div>
                  <div className="mb-6">
                    <p className="text-4xl font-bold text-white">
                      ₹ {totalAmount}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button className="bg-transparent hover:bg-white hover:bg-opacity-10 text-cyan-400 font-semibold py-2 px-4 rounded-full border border-cyan-400 transition-colors duration-300">
                      Withdraw
                    </button>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2"></div>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setIsClicked(true)}
                className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center transition duration-300 ${
                  isClicked ? "bg-blue-700" : "bg-gray-600 hover:bg-blue-700"
                } text-white`}
              >
                <FaUsers className="mr-2" size={18} />
                USERS
              </button>
              <button
                onClick={() => setIsClicked(false)}
                className={`flex-1 py-2 px-4 rounded-full flex items-center justify-center transition duration-300 ${
                  isClicked ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                <FaHistory className="mr-2" size={18} />
                HISTORY
              </button>
            </div>

            {!isClicked ? (
              <div className="rounded-lg p-4 shadow-md my-4">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left border-b-2 w-full">
                        <h2 className="text-ml font-bold ">PAYMENT HISTORY</h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.map((value, i) => (
                      <tr key={i} className="border-b w-full">
                        <td className="px-4 py-2 text-left align-top w-1/2 ">
                          <div>
                            <h2 className="text-sm">
                              Total pupils - {value.numberOfUsers}
                            </h2>
                            <p className="text-xm text-gray-400 ">
                              {formatDate(value.createdAt)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right text-cyan-500 w-1/2">
                          <p>
                            <span>{value.amount}₹</span>
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg p-4 shadow-md my-4">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left border-b-2 w-full">
                        <h2 className="text-ml font-bold ">USER HISTORY</h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {numOfUsers[0]?.users.map((value:any, i:any) => (
                      <tr key={i} className="border-b w-full">
                        <td className="px-4 py-2 text-left w-1/2 ">
                          <div>
                            <h2 className="text-sm">
                              {value.userId.fullname}
                            </h2>
                            <p className="text-xm text-gray-400 ">
                              {formatDate(value.date)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
