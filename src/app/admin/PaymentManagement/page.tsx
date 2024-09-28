"use client";
import { FaLock, FaUnlock, FaRegUserCircle } from "react-icons/fa";
import { Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/Admin/AdminLayout";
import axiosInstance from "@/lib/adminAxios";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { FaAmazonPay } from "react-icons/fa";
import { IoMdDoneAll } from "react-icons/io";

interface User {
  _id: string;
  name: string;
  status: boolean;
  amount: string;
  proId: string;
  users: [];
  // Add more fields as needed
}

const PaymentManagement = () => {
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [usersData, setUsersData] = useState([]);

  const updatauser = async () => {
    const responses = await axiosInstance.get("/api/admin/getProPayment");
    console.log(responses.data.data);
    setUsers(responses.data.data);
  };

  useEffect(() => {
    updatauser();
    setReload(false);
  }, [reload]);

  const handleAction = async (data: any) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "pay",
      }).then(async (result) => {
        if (result.isConfirmed) {
        
        const value = {
          proId: data.proId,
          numberOfUsers: data.users.length,
          amount: data.amount,
        };
        const responses = await axiosInstance.post(
          "/api/admin/addWallet",
          value
        );
        const res = await axiosInstance.patch(
          `/api/admin/proPayStatus/${data.proId}`
        );
        updatauser();
        toast.success("SUCCESSFULLY PAYED", {
          position: "top-center",
        });
      }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = (data: any) => {
    setUsersData(data);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  return (
    <AdminLayout>
      <div className="bg-black text-white flex flex-col items-center w-full h-screen overflow-hidden">
        <div className="w-full h-full">
          <div className="p-6 px-36">
            <h1 className="text-lg font-semibold py-4  text-white underline">
              PAYMENT MANAGEMENT
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
                  <th className="px-6 py-4">TOTAL USERS</th>
                  <th className="px-6 py-4">AMOUNT</th>
                  <th className="px-6 py-4">MORE INFO</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((data) => data.name.includes(searchQuery))
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className="text-white border-b border-b-white text-sm"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">{user.name}</td>
                      <td className="px-6 py-4">{user.users.length}</td>
                      <td className="px-6 py-4">{user.amount}</td>
                      <td
                        onClick={() => openModal(user.users)}
                        className="px-6 py-4 text-blue-400 hover:text-blue-800"
                      >
                        VIEW
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAction(user)}
                          className={`${
                            user.status ? "bg-green-500" : "bg-blue-500"
                          } text-black font-bold py-2 px-4 w-24 rounded-lg flex justify-center ${
                            user.status ? "cursor-not-allowed opacity-50" : ""
                          }`} // Add classes to indicate the button is disabled
                          disabled={user.status} // Disable the button when user.status is true
                        >
                          {user.status ? <IoMdDoneAll className="w-10 h-6" /> : <FaAmazonPay className="w-10 h-6"/>}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <dialog id="my_modal_1" className="modal " ref={modalRef}>
              <div className="modal-box w-60">
                <h3 className="font-bold text-sm ">USER NAME</h3>
                <div className="pl-10 text-gray-500">
                  <table className="min-w-full">
                    <tbody>
                      {usersData.map(
                        (
                          user: {
                            userId: any;
                          },
                          index: number
                        ) => (
                          <tr key={index}>
                            <td className="flex items-center px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-white">
                              <FaRegUserCircle className="mr-2 h-6 w-6" />
                              {user.userId.fullname}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
            {/* <div className=" absolute bottom-0 left-0 right-0 flex items-center justify-center">
              <span className="text-lg">1 / 4</span>
              <button className="text-lg px-6 py-3 rounded">NEXT</button>
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PaymentManagement;
