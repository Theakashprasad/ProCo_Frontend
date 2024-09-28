import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare, faComment } from "@fortawesome/free-solid-svg-icons";
import avatar from "../../assets/landing/profile-pictures/user1.jpg";
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
import { toast } from "sonner";
import useUser from "@/Hook/useUser";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface User {
  _id: string;
  name: string;
  creator: string;
  fullname: string;
}

const GroupVideoCall = () => {
  const { setSelectedConversation } = useStore();
  const { selectedConversation } = useStore();
  console.log("selectedConversation", selectedConversation);
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueProfessions, setUniqueProfessions] = useState<string[]>([]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [users, setUser] = useState(initialUserState);
  const [data, setData] = useState<User[]>([]);
  const router = useRouter();
  const { user } = useUser();
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/pro/groupVideoGet`,{withCredentials:true});
        console.log("sdfs", res.data.data);
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [setUser]);

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevents closing when clicking inside the modal
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmitt = async () => {
    const response = await axios.post(`${BASE_URL}/api/pro/groupVideo`, {
      email: users.email,
      name: name,
      creator: users._id,
    },{withCredentials:true});
    if (response.data.success) {
      setData((prevData) => [
        ...prevData,
        {
          _id: response.data.data._id, // Assuming the server returns the new item with an id
          name: name,
          creator: users._id,
          fullname: users.fullname, // Use user.fullname here
        },
      ]);
      setIsModalOpen(false);
      toast.success("SAVE", {
        position: "top-center",
      });
    }
  };

  console.log(user?.isPro);

  return (
    <div>
      <Card className=" mb-4 shadow-lg rounded-lg">
        <CardContent className="bg-[#0d0d0d] text-white min-h-screen">
          <div className="flex justify-between items-center mb-4 w-full px-10 ">
            <div className="mb-6 text-white">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-half text-white"
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
            </div>
          </div>
          {user?.isPro && (
            <div className="">
              <div className="bg-[#0d0d0d] h-36 flex p-10 gap-10 items-center rounded-xl">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="border w-1/2 h-14 rounded-3xl"
                >
                  CREATE ROOM ID +
                </button>
              </div>
            </div>
          )}

          {data.map((data, i) => (
            <div
              key={i} // Using user._id as the unique key
              className="flex items-center bg-[#1b1b1b] rounded-lg p-4 w-2/3 ml-10 "
            >
              <Image
                src="data:image/jpeg;base64,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"
                alt="profile picture"
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
              <div className=" w-full flex justify-between items-center">
                <div className="text-left">
                  <Typography variant="h6" className="uppercase">
                    {data.creator?.fullname || data.fullname}
                  </Typography>
                </div>
                <div className="relative group">
                  <span className="absolute bottom-full rounded-xl mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-200 text-gray-700 px-2 py-1  text-xs">
                    Copy
                  </span>
                  <div className="bg-gray-400 px-4 py-1 rounded-xl">
                    <span className="text-white">{data.name}</span>
                  </div>
                </div>
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
              <h1 className="font-bold text-center">CREATE ID -</h1>
              <div className="ml-20 ">
                <Input
                  placeholder="SET GROUP ID"
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
                  onClick={handleSubmitt}
                  type="button"
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

export default GroupVideoCall



