"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaPenToSquare } from "react-icons/fa6";
import { CiYoutube } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { profileSchema } from "@/Types/Schema";
import { toast } from "sonner";
import axios from "axios";
import useUser from "@/Hook/useUser";
import withProtectedRoute from "@/app/protectedRoute";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import UserProfile from "@/components/profile/UserProfile";
import Payment from "@/components/profile/Payment";
import { IoCloseSharp } from "react-icons/io5";
import ChangePassword from "@/components/profile/ChangePassword";
import axiosInstance from "@/lib/axios";
import Footer from "@/components/landing/Footer";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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
interface Profile {
  profession: string;
  education: string;
  age: string;
  about: string;
  gender: string;
  imageUrl: string;
  email: string;
  hobbies: string;
  Interest: string;
  country: string;
  state: string;
  Linkedin: string;
}

const ProfilePage = () => {
  const params = useParams();
  const [userId, setUserId] = useState(params);
  console.log("params", params.userId);

  const socialIcons = [
    { icon: <FaFacebookSquare />, name: "facebook" },
    { icon: <FaInstagram />, name: "instagram" },
    { icon: <CiYoutube />, name: "youtube" },
  ];
  const [isEditing, setIsEditing] = useState(false);
  const fileReOfBg = useRef<HTMLInputElement | null>(null);
  const fileRefOfUser = useRef<HTMLInputElement | null>(null);
  const [age, setAge] = useState(0);
  const [userData, setUserData] = useState<Profile | undefined>();
  //email from the custome hook
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<User>();
  const [modal, setModal] = useState(false);
  const router = useRouter();

  const [followCount, setFollowCount] = useState(0);

  function calculateAge(e: React.ChangeEvent<HTMLInputElement>) {
    // Convert the birth date string to a Date object
    const birthDateString = e.target.value;
    const birthDate = new Date(birthDateString);
    const today = new Date();

    // Calculate the age
    let ageOfUser = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust the age if the birthday has not occurred yet this year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      ageOfUser--;
    }
    setAge(ageOfUser);
    // console.log(ageOfUser);
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });
    }
  };
  ////// For the profile data when it is ist uploading
  useEffect(() => {
    async function userData() {
      try {
        const responses = await axiosInstance.post("/api/userProfileData", {
          userId,
        });
        setUserData(responses.data.data);
        setUserInfo(responses.data.userData);
        
        const senterId = userId.userId;
        const res = await axios.get(
          `http://localhost:3005/api/pro/connectionFindPro/${senterId}`,
          { withCredentials: true }
        );
        console.log("responses.data.data", res.data);

        const countAccepts = res.data.data.filter(
          (item: { follow: string }) => item.follow === "accept"
        ).length;
        setFollowCount(countAccepts);
      } catch (error) {
        console.log("erroe form the userData", error);
      }
    }
    userData();
  }, [setUserData, setFollowCount, setUserInfo, userId]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error && error.message && Object.keys(errors).length == 5) {
          toast.warning(error.message, { position: "top-left" });
        } else {
          toast.error(error.message, { position: "top-left" });
        }
      });
    }
  }, [errors]);


  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1472376758045-62f519fc676d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmF0YXVyJTIwdmVydGljYWx8ZW58MHx8MHx8fDA%3D"
  );

  return (
    <div
      className="min-h-screen text-white p-5 bg-cover bg-center"
      style={{
        backgroundImage:
          // "url(https://images.unsplash.com/photo-1691137716347-02932ba769dd?w=1000&auto=format&fit=crop&q=100)",
          "url(https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3)",
      }}
    >
      <div className="container mx-auto py-3">
        <div className="flex justify-between items-center mb-8 px-3">
          <div className="flex justify-between ">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1 h-11 w-16 text-white rounded-lg hover:bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <MdOutlineKeyboardBackspace className="h-10 w-10" />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              {" "}
              <span className="text-xl font-serif tracking-tight font-extrabold pl-7 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
                ProCo .
              </span>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/4">
            <div className=" p-9 rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5">
              <h2 className="text-lg font-semibold mb-4 text-white underline uppercase">
                Resources
              </h2>
              <div></div>
            </div>
          </div>
          <div className="w-3/4 ml-8">
            <form>
              <div className="p-8 rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5">
                <div className="flex items-center mb-6">
                  <div className="bg-cover bg-center h-44 w-full rounded-lg">
                    <Image
                      // src="https://plus.unsplash.com/premium_photo-1686361282482-5d734839142f?w=1500"
                      // src="https://images.unsplash.com/photo-1472376758045-62f519fc676d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmF0YXVyJTIwdmVydGljYWx8ZW58MHx8MHx8fDA%3D"
                      src={imageUrl}
                      alt="Profile Picture"
                      width={1000}
                      height={500}
                      className="h-44 w-full cursor-pointer  rounded-lg bg-white" // layout="fill" // Ensures the image covers the container
                      objectFit="cover" // Keeps the aspect ratio and covers the container
                      quality={100} // Optional: controls the image quality
                    />
                  </div>
                </div>

                <div className="flex items-center mb-6">
                  <div className="">
                    <Image
                      src={
                        userData?.imageUrl
                          ? userData.imageUrl
                          : "https://i.pinimg.com/236x/c9/36/5d/c9365d2bd2b7bff2b7e3a8f1cb6a0dff.jpg"
                      }
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      className="h-24 w-24 bg-cover bg-center  cursor-pointer p-1  rounded-full bg-white"
                      onClick={() => fileRefOfUser.current?.click()}
                      priority
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h2 className="text-2xl font-bold uppercase">
                      {userInfo?.fullname}
                    </h2>
                    <p className="text-white ">
                      {userData?.profession ? userData.profession : ""}
                    </p>
                    <p className="text-sm text-gray-400">
                      <span className="text-xm ">{followCount} </span> followers{" "}
                    </p>
                  </div>
                </div>
                <div className="text-white">
                  <div className="container mx-auto ">
                    <div className="bg-gray-900 bg-opacity-20 backdrop-blur-lg p-8 rounded-lg mb-6">
                      <div className="flex justify-between gap-5 ">
                        <div>
                          <h3 className="font-semibold uppercase">
                            Profession
                          </h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.profession}
                              {...register("profession")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.profession ? userData.profession : ""}
                            </p>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold uppercase">Gender</h3>
                          {isEditing ? (
                            <select
                              className="w-52  h-7  bg-[#343434] rounded-lg "
                              {...register("gender")}
                            >
                              <option value=""></option>
                              <option value="male">male</option>
                              <option value="female">female</option>
                              {/* Add city options here */}
                            </select>
                          ) : (
                            <p className="text-gray-400">
                              {userData?.gender ? userData.gender : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold uppercase">Education</h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.education}
                              {...register("education")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.education ? userData.education : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 ">
                        <div>
                          <h3 className="font-semibold uppercase">Age</h3>
                          {isEditing ? (
                            <input
                              type="date"
                              className="bg-[#343434] rounded-lg p-2"
                              onChange={calculateAge}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.age ? userData.age : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-center ">
                          <h3 className="font-semibold uppercase">hobbies</h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.hobbies}
                              {...register("hobbies")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.hobbies ? userData.hobbies : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold uppercase">Interest</h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.Interest}
                              {...register("Interest")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.Interest ? userData.Interest : ""}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 mt-4 ">
                        <div className="text-left">
                          <label
                            htmlFor="country"
                            className="font-semibold uppercase"
                          >
                            country
                          </label>{" "}
                          {isEditing ? (
                            // w-52  h-7  bg-[#343434] rounded-lg
                            <select
                              className="w-full p-2 border border-black rounded-lg bg-[#343434] "
                              {...register("country")}
                            >
                              <option value=""></option>
                              <option value="India">India</option>
                              {/* Add city options here */}
                            </select>
                          ) : (
                            <p className="text-gray-400">
                              {userData?.country ? userData.country : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-center ">
                          <h3 className="font-semibold uppercase">Linkedin</h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.Linkedin}
                              {...register("Linkedin")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.Linkedin ? userData.Linkedin : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <h3 className="font-semibold uppercase">state</h3>
                          {isEditing ? (
                            <input
                              type="text"
                              className="bg-[#343434] rounded-lg p-2"
                              placeholder={userData?.state}
                              {...register("state")}
                            />
                          ) : (
                            <p className="text-gray-400">
                              {userData?.state ? userData.state : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-900 bg-opacity-20 backdrop-blur-lg p-8 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold mb-2 uppercase">
                        ABOUT
                      </h3>

                      {isEditing ? (
                        <input
                          type="text"
                          className="bg-[#343434] rounded-lg w-full h-20 p-4"
                          placeholder={userData?.about}
                          style={{ verticalAlign: "top", paddingTop: "8px" }}
                          {...register("about")}
                        />
                      ) : (
                        <p className="text-gray-400">
                          {userData?.about ? userData.about : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-12">
        <Footer/>
        </div>
      </div>
    </div>
  );
};
export default withProtectedRoute(ProfilePage);
