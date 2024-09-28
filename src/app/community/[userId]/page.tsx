"use client";
import { useEffect, useState } from "react";
import Question from "@/components/home/Question";
import { useParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import { IoIosArrowDropdown } from "react-icons/io";
import { IoIosArrowDropup } from "react-icons/io";
import Image from "next/image";
import Room from "@/app/Room/page";
import AddQuizz from "@/components/Category/Quizz/AddQuizz";

interface Member {
  userId: {
    _id: string;
    fullname: string;
    email: string;
  };
  status: string;
}

interface CommunityData {
  _id: string;
  name: string;
  creator: string;
  members: Member[];
  profilePic: string;
  createdAt: string;
  updatedAt: string;
  groupCode:string;
}

const Dashboard = () => {
  const params = useParams();
  const router = useRouter();

  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const [showOverlay, setShowOverlay] = useState(true);
  const [communityData, setCommunityData] = useState<CommunityData | null>(
    null
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown
  const [isClicked, setIsClicked] = useState(1); // for rendering side components

  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;
  console.log("asklfddas", communityData);

  const fetchData = async () => {
    try {
      const proUserData = await axiosInstance.get(
        `/api/pro/CommunityUser/${params.userId}`
      );
      const data = proUserData.data.data as CommunityData;
      setCommunityData(data);
      const isUserInCommunity = (members: Member[]) => {
        return members.find((member) => member.userId._id === user?._id);
      };
      const dataOfUser = isUserInCommunity(data.members);
      if (user.role == "profesional" || dataOfUser?.status === "accept") {
        setShowOverlay(false);
      } else {
        setShowOverlay(true);
      }
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, params.userId]);

  const handleReq = async (userId: string, status: string) => {
    const data = {
      userId: userId,
      communityId: params.userId,
      status: status,
    };
    await axiosInstance.post("/api/pro/statusUpdate", data);
    fetchData();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const renderPage = () => {
    switch (isClicked) {
      case 1:
        return <Question userId={userId} />;
      case 2:
        return <Room userId={userId}/>;
      case 3:
        return <AddQuizz userId={userId}/>;

      default:
        return <Question userId={userId} />;
    }
  };
  return (
    <div className="w-screen flex">
      {showOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <button className="bg-white text-black font-bold py-2 px-4 rounded-full">
            YOU DO NOT HAVE ACCESS
          </button>
          <br />
          <button
            type="button"
            onClick={() => router.back()}
            className=" p-1 h-11 w-16 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <MdOutlineKeyboardBackspace className="h-10 w-10" />
          </button>
        </div>
      )}

      <div className="w-[25%] h-screen bg-black text-white">
        <div className="flex justify-between pt-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="ml-4 p-1 h-11 w-16 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500"
          >
            <MdOutlineKeyboardBackspace className="h-10 w-10" />
          </button>
        </div>
        <div className="flex items-center pb-2 mx-14">
          <div className="ml-8 ">
            <Image
              src={communityData?.profilePic || ""}
              alt="profile picture"
              width={100}
              height={50}
              className="rounded-full mr-4"
            />
            <h3 className="text-2xl font-extrabold">{communityData?.name}</h3>
          </div>
        </div>
        <hr />

        {/* Dropdown for Community Members */}
        <div className="flex-col justify-center items-center mt-3 w-full ">
          <h2 className="font-bold text-sm uppercase flex justify-center">
            Community Members
          </h2>
          <button
            onClick={toggleDropdown}
            className="w-full text-left pl-4 text-white p4 rounded-md hover:text-gray-600"
          >
            {isDropdownOpen ? (
              <IoIosArrowDropup className="w-8 h-8 " />
            ) : (
              <IoIosArrowDropdown className="w-8 h-8" />
            )}
          </button>

          {isDropdownOpen && communityData?.members?.length ? (
            communityData.members.map((member, index) => (
              <div
                key={index}
                className="mb-4 p-2 text-center bg-[#1b1b1b] rounded-md"
              >
                <p>
                  <strong>Name:</strong> {member.userId.fullname}
                </p>
                {user.role == "profesional" && (
                  <button>
                    <p>
                      <strong>Status:</strong>{" "}
                      {member.status === "pending" ? (
                        <>
                          <span className="text-yellow-500">Pending</span>
                          <div className="mt-2">
                            <button
                              onClick={() =>
                                handleReq(member.userId._id, "accept")
                              }
                              className="bg-green-500 text-white py-1 px-4 rounded-md mr-2"
                            >
                              <TiTick />
                            </button>
                            <button
                              onClick={() =>
                                handleReq(member.userId._id, "reject")
                              }
                              className="bg-red-500 text-white py-1 px-4 rounded-md"
                            >
                              <ImCross />
                            </button>
                          </div>
                        </>
                      ) : member.status === "accept" ? (
                        <span className="text-green-500">Accepted</span>
                      ) : member.status === "reject" ? (
                        <span className="text-red-500">Rejected</span>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </p>
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="mt-4">{isDropdownOpen ? "No members found." : ""}</p>
          )}

          <section className="flex pt-4">
            <aside className=" bg-black p-4 rounded-lg shadow-lg w-full">
              <div className="space-y-3 mb-10 text-sm w-full">
                <button
                  onClick={() => setIsClicked(1)}
                  className={`w-full text-left text-white p-2 rounded-md flex justify-between items-center relative overflow-hidden group ${
                    isClicked === 1
                      ? "bg-gradient-to-r from-purple-600 to-blue-500"
                      : "bg-[#1b1b1b]"
                  }`}
                >
                  <span className="relative z-10">QUESTIONS</span>
                  {/* <GoFileMedia className="relative z-10" /> */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
  onClick={() => setIsClicked(2)}
  className={`w-full text-left text-white p-2 rounded-md flex justify-between items-center relative overflow-hidden group ${
    isClicked === 2 ? "bg-gradient-to-r from-purple-600 to-blue-500" : "bg-[#1b1b1b]"
  }`}
>
  <span className="relative z-10 flex items-center">
    GROUP VIDEO CALL
    {communityData?.groupCode !== null && (
      <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full"></span>
    )}
  </span>
  {/* <FaUsers className="relative z-10" /> */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
</button>

                <button
                  onClick={() => setIsClicked(3)}
                  className={`w-full text-left text-white p-2 rounded-md flex justify-between items-center relative overflow-hidden group ${
                    isClicked === 3
                      ? "bg-gradient-to-r from-purple-600 to-blue-500"
                      : "bg-[#1b1b1b]"
                  }`}
                >
                  <span className="relative z-10">QUIZZ</span>
                  {/* <IoPeopleSharp  className="relative z-10" /> */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </aside>
          </section>
        </div>
      </div>
      {renderPage()}
    </div>
  );
};

export default Dashboard;
