"use client";
import {
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { Input } from "@mui/material";
import { use, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AdminLayout from "@/components/Admin/AdminLayout";
import {
  useRef,
  ChangeEvent,
  MouseEvent,
  FormEvent,
  SetStateAction,
  Dispatch,
} from "react";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/adminAxios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;


interface User {
  _id: string;
  email: string;
  block: boolean;
  image: string;
  about: string;
  authorDetails: any;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState("");
  const [data, setData] = useState<User | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const updatauser = async () => {
      const res = await axios.get(`${BASE_URL}/api/pro/Allblogs`);
      console.log("res", res.data.data);
      setUsers(res.data.data);
    };
    updatauser();
    setReload(false);
  }, [reload]);

  const handleAction = async (userId: string, block: boolean) => {
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
          console.log("sdsh", userId, block, typeof block);
          const action = block ? false : true;
          const status = block ? "unblocked" : "blocked";
          console.log("bool", action, typeof action);

          const res = await axiosInstance.patch(
            `/api/admin/blogVerify/${userId}/${action}`
          );
          toast.error(`This post has been ${status}`, {
            position: "top-center",
          });

          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id == userId ? { ...user, block: action } : user
            )
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  //

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevents closing when clicking inside the modal
  };

  const handleImage = (imageUrl: string, data: any) => {
    setImage(imageUrl);
    setData(data);
    setIsModalOpen(true);
  };

  // Handler to go to the next image
  const goToNextImage = (blogId: string) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[blogId] ?? 0;
      const totalImages =
        users.find((blog) => blog._id === blogId)?.image.length || 1;
      return { ...prev, [blogId]: (currentIndex + 1) % totalImages };
    });
  };

  // Handler to go to the previous image
  const goToPrevImage = (blogId: string) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[blogId] ?? 0;
      const totalImages =
        users.find((blog) => blog._id === blogId)?.image.length || 1;
      return {
        ...prev,
        [blogId]: (currentIndex - 1 + totalImages) % totalImages,
      };
    });
  };

  return (
    <AdminLayout>
      <div className="bg-black text-white flex flex-col items-center w-full h-screen overflow-hidden">
        <div className="w-full h-full">
          <div className="p-6 px-36">
            <h1 className="text-lg font-semibold py-4  text-white underline">
              BLOG MANAGEMENT
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
                  <th className="px-6 py-4">ABOUT</th>
                  <th className="px-6 py-4">IMAGE</th>
                  <th className="px-6 py-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {users
                  // .filter(
                  // (data) =>
                  //     data.isVerified == true &&
                  //     data.role == "user" &&
                  // data.email.includes(searchQuery)
                  // )
                  .map((user, index) => (
                    <tr
                      key={user._id}
                      className="text-white border-b border-b-white text-sm"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        {user.authorDetails.fullname}
                      </td>
                      <td className="px-6 overflow-x-scroll text-center">
                        {user.about}
                      </td>
                      <td className="px-6 py-4 ">
                        {" "}
                        <button
                          className="bg-blue-400  rounded-lg px-2 hover:bg-blue-800"
                          onClick={() => handleImage(user.image, user)}
                        >
                          view
                        </button>
                      </td>
                      <td className="px-6 py-4 ">
                        <button
                          onClick={() => handleAction(user._id, user.block)}
                          className={`${
                            user.block ? "bg-blue-500" : "bg-green-500"
                          } text-black font-bold py-2 px-4 w-24 rounded-lg flex justify-center`}
                        >
                          {user.block ? <FaLock /> : <FaUnlock />}
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
        {/*  */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative bg-zinc-700 p-6 rounded-lg shadow-lg w-1/2 h-2/3"
              onClick={handleModalClick}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 px-4 py-2 rounded-lg"
              >
                X{" "}
              </button>
              <div className="flex"></div>
              <div>
                <div className="relative p-4 rounded-lg mb-4 h-[30rem] flex justify-center w-full">
                  {data && data.image.length > 0 && (
                    <Image
                      src={image[currentImageIndex[data?._id] ?? 0]}
                      width={1000}
                      height={100}
                      priority
                      alt="Picture of the author"
                    />
                  )}
                  {data && data.image.length > 1 && (
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                      onClick={() => goToPrevImage(data?._id)}
                    >
                      &lt;
                    </button>
                  )}
                  {data && data.image.length > 1 && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                      onClick={() => goToNextImage(data?._id)}
                    >
                      &gt;
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
