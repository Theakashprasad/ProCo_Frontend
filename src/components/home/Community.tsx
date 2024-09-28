import {
  Avatar,
  Button,
  Card,
  CardContent,
  Input,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useState, MouseEvent, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import useStore from "@/store/user";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";


type creator = {
  _id: any;
  fullname: string;
};

interface User {
  members: [];
  _id: string;
  name: string;
  role: string;
  creator: creator;
  profilePic: string;
}

const Community = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const [data, setData] = useState<User[]>([]);
  const router = useRouter();
  const [req, setReq] = useState(false);
  useEffect(() => {
    fetchData();
  }, [setUser]);
  async function fetchData() {
    try {
      const proUserData = await axiosInstance.get("/api/pro/totalCommunity");
      console.log("data", proUserData.data.data);
      setData(proUserData.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevents closing when clicking inside the modal
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    const toDoData = await axiosInstance.post("/api/pro/createCommunity", {
      name: name,
      creator: user._id,
    });
    toast.success("Community created successfully!");
    setIsModalOpen(false);
    fetchData();
  };

  const handleReq = async (data: User) => {
    console.log("aksjfksajd");
    const toDoData = await axiosInstance.post("/api/pro/communityReq", {
      userId: user._id,
      communityId: data._id,
    });
    toast.success("REQUEST HAS BEEN SENT");
    setReq(true);
  };
  const handleView = (data: User) => {
    if (data.creator?._id == user._id) {
      router.push(`/community/${data._id}`);
    } else {
      toast.error("RESTRICTED!");
    }
    console.log("sdfsdf", data, user._id);
  };
  const isUserInCommunity = (
    members: Array<{ userId: string; status: string }>
  ) => {
    return members.some((member) => member.userId === user._id);
  };

  const handleEnter = (data: User) => {
    router.push(`/community/${data._id}`);
  };
  return (
    <div>
      <Card className=" mb-4 shadow-lg rounded-lg ">
        <CardContent className="bg-[#0d0d0d] text-white min-h-screen">
          <div className="flex justify-between items-center mb-4 w-full px-10 "></div>
          <div className="pb-5">
            {user.role == "profesional" && (
              <div className="h-36 flex p-10 gap-10 items-center rounded-xl">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="border w-1/2 h-14 rounded-3xl"
                >
                  Start posting
                </button>
              </div>
            )}
          </div>
          {data.map((data, i) => (
            <div
              key={i} // Using user._id as the unique key
              className="flex items-center bg-[#1b1b1b] rounded-xl p-2 w-2/3 ml-10 mt-3"
            >
              <Image
                src={data?.profilePic}
                alt="profile picture"
                width={100}
                height={50}
                className="rounded-full mr-4"
              />
              <div className=" w-full flex justify-between items-center">
                <div className="text-left">
                  <Typography variant="h6">{data.name}</Typography>
                  <Typography>Name: {data.creator?.fullname}</Typography>
                </div>
                {user?.role == "user" ? (
                  isUserInCommunity(data?.members) || req ? (
                    <div className="bg-green-400 px-4 py-1 rounded-xl hover:bg-green-800">
                      <button onClick={() => handleEnter(data)}>ENTER</button>
                    </div>
                  ) : (
                    <div className="bg-blue-400 px-4 py-1 rounded-xl hover:bg-blue-800">
                      <button onClick={() => handleReq(data)}>
                        SEND REQUEST
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-blue-400 hover:bg-blue-900 px-4 py-1 rounded-xl">
                    <button onClick={() => handleView(data)}>VIEW</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-zinc-700 p-6 rounded-lg shadow-lg w-1/2 h-2/2"
            onClick={handleModalClick}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 px-4 py-2 rounded-lg"
            >
              <IoMdClose />
            </button>
            <div className="flex items-center">
              <h1 className="font-bold text-center">CREATE GROUP -</h1>
              <div className="ml-20 ">
                <Input
                  placeholder="SET GROUP NAME"
                  className="w-half text-white "
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "gray",
                    },
                    "& .MuiInput-underline:hover:before": {
                      borderBottomColor: "lightgray",
                    },
                    "& .MuiInput-underline:after": {
                      borderBottomColor: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                  }}
                />
                <button
                  onClick={handleSubmit}
                  className="absolute  right-16 px-4 py-1 bg-blue-500 text-white rounded-3xl"
                >
                  save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
