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
import useDataMain from "@/Hook/blockCheck";
import withProtectedRoute from "@/app/protectedRoute";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import UserProfile from "@/components/profile/UserProfile";
import Payment from "@/components/profile/Payment";
import { IoCloseSharp } from "react-icons/io5";
import ChangePassword from "@/components/profile/ChangePassword";
import Footer from "@/components/landing/Footer";
import axiosInstance from "@/lib/axios";
import Blogs from "@/components/profile/Blogs";

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
  const [email, setEmail] = useState<string | undefined>();
  const { userDatas } = useDataMain();
  const [userInfo, setUserInfo] = useState<User>();
  const [modal, setModal] = useState(false);
  const router = useRouter();
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [userId, setUserId] = useState(initialUserState);
  const [followCount, setFollowCount] = useState(0);
  const [openPsmodal, setOpenPsmodal] = useState(false);
  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setUserInfo(userDatas);
    }
  }, [user, setUserInfo, userDatas]);

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
        const responses = await axios.post(
          `${BASE_URL}/api/userData`,
          { email: email },
          { withCredentials: true }
        );
        setUserData(responses.data.data);

        const senterId = userId._id;
        const res = await axios.get(
          `http://localhost:3005/api/pro/connectionFindPro/${senterId}`,
          { withCredentials: true }
        );
        const countAccepts = res.data.data.filter(
          (item: { follow: string }) => item.follow === "accept"
        ).length;
        setFollowCount(countAccepts);
      } catch (error) {
        console.log("erroe form the userData", error);
      }
    }
    userData();
  }, [email, setUserData, setFollowCount]);

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
  const handleChange = async (data: z.infer<typeof profileSchema>) => {
    const formData = new FormData();
    formData.append("profession", data.profession);
    formData.append("education", data.education);
    formData.append("age", age.toString());
    formData.append("hobbies", data.hobbies);
    formData.append("Interest", data.Interest);
    formData.append("country", data.country);
    formData.append("linkedin", data.Linkedin);
    formData.append("state", data.state);
    formData.append("about", data.about);
    formData.append("file", data.file);
    formData.append("gender", data.gender);
    formData.append("email", email ?? "");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/userProfile`,
        formData,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success("SUCCESS", {
          position: "top-center",
        });
        setIsEditing(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error?.response?.data.message ||
            "An error occurred. Please try again.",
          {
            position: "top-left",
          }
        );
      } else {
        console.log("An unexpected error occurred:", error);
      }

      console.log(error);
    }
  };
  const [isClicked, setIsClicked] = useState(1);
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

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
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-1 h-11 w-16 text-white rounded-xl hover:bg-gradient-to-r from-purple-500 to-blue-500"
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
              <div className="space-y-2">
                {/* CHAT */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsClicked(1);
                  }}
                  type="button"
                  className={`w-full text-left text-white text-sm p-2 relative overflow-hidden group rounded-md focus:outline-none flex justify-between items-center 
                   ${isClicked === 1 ? "bg-gray-500" : "bg-[#4c4c4c]"}`}
                >
                  <span className="relative z-10">PROFILE</span>

                  <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                {/* FOLLOW */}
                <div>
                  <button
                    onClick={() => setIsClicked(2)}
                    className={`w-full text-left text-white text-sm p-2 relative overflow-hidden group rounded-md focus:outline-none flex justify-between items-center 
                   ${isClicked === 2 ? "bg-gray-500" : "bg-[#4c4c4c]"}`}
                  >
                    <span className="relative z-10">CONNECTION</span>

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
                {/* payment */}
                <div>
                  <button
                    onClick={() => setIsClicked(3)}
                    className={`w-full text-left text-white text-sm p-2 relative overflow-hidden group rounded-md focus:outline-none flex justify-between items-center 
                   ${isClicked === 3 ? "bg-gray-500" : "bg-[#4c4c4c]"}`}
                  >
                    <span className="relative z-10">PAYMENT</span>

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setIsClicked(4)}
                    className={`w-full text-left text-white text-sm p-2 relative overflow-hidden group rounded-md focus:outline-none flex justify-between items-center 
                   ${isClicked === 4 ? "bg-gray-500" : "bg-[#4c4c4c]"}`}
                  >
                    <span className="relative z-10">SAVED</span>

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {isClicked == 1 && (
            <div className="w-3/4 ml-8">
              <form onSubmit={handleSubmit(handleChange)}>
                <div className="p-8 rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5">
                  <div className="flex items-center mb-6">
                    <div className="bg-cover bg-center h-44 w-full rounded-lg">
                      <Image
                        src={imageUrl}
                        alt="Profile Picture"
                        width={1000}
                        height={500}
                        className="h-44 w-full cursor-pointer  rounded-lg bg-white"
                        onClick={openModal}
                        objectFit="cover"
                        quality={100}
                      />
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input
                      type="file"
                      ref={fileRefOfUser}
                      hidden
                      className="p-2 border border-black rounded-lg bg-white"
                      onChange={handleFileChange}
                    />
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
                        <span className="text-xm ">{followCount} </span>{" "}
                        followers{" "}
                      </p>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents the event from bubbling up to parent components
                          setOpenPsmodal(true);
                        }}
                        className="bg-black hover:bg-gray-700 rounded-xl p-2"
                      >
                        {" "}
                        Change Password
                      </button>
                    </div>
                    {isEditing ? (
                      <div className="pl-5">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className=" text-white  rounded"
                        >
                          <IoCloseSharp className="w-8 h-8 text-red-400" />
                        </button>
                        <button type="submit" className=" text-white rounded">
                          <TiTick className="w-8 h-8 text-green-400" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing((state) => !state);
                        }}
                        className=" text-white px-4 py-2 rounded"
                      >
                        <FaPenToSquare />
                      </button>
                    )}
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
                                className="rounded-xl p-2"
                                value={userData?.profession}
                                {...register("profession")}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.profession
                                  ? userData.profession
                                  : ""}
                              </p>
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold uppercase">Gender</h3>
                            {isEditing ? (
                              <select
                                className="w-52 h-9 rounded-xl"
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
                            <h3 className="font-semibold uppercase">
                              Education
                            </h3>
                            {isEditing ? (
                              <input
                                type="text"
                                className=" rounded-xl p-2"
                                value={userData?.education}
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
                                className="rounded-xl p-2"
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
                                className="rounded-xl p-2"
                                value={userData?.hobbies}
                                {...register("hobbies")}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.hobbies ? userData.hobbies : ""}
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <h3 className="font-semibold uppercase">
                              Interest
                            </h3>
                            {isEditing ? (
                              <input
                                type="text"
                                className="rounded-xl p-2"
                                value={userData?.Interest}
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
                                className="w-[75%] p-2 border border-black rounded-xl "
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
                            <h3 className="font-semibold uppercase">
                              Linkedin
                            </h3>
                            {isEditing ? (
                              <input
                                type="text"
                                className="rounded-xl p-2"
                                value={userData?.Linkedin}
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
                                className="rounded-xl p-2"
                                value={userData?.state}
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
                            className="rounded-xl w-full h-20 p-4"
                            value={userData?.about}
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

              <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                  <h3 className="font-bold text-lg ">SELECT IMAGES</h3>
                  <p className="pb-7 text-xs">
                    click on any image or close to exit
                  </p>
                  <div className=" flex gap-2 ">
                    <div className="bg-cover bg-center h-26 w-36 rounded-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1657014513094-9103919ebe20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRhcmslMjBncmVlbiUyMGhvcml6b250YWx8ZW58MHx8MHx8fDA%3D"
                        alt="Profile Picture"
                        width={1000}
                        height={500}
                        className=" cursor-pointer  rounded-lg"
                        onClick={() =>
                          setImageUrl(
                            "https://images.unsplash.com/photo-1657014513094-9103919ebe20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGRhcmslMjBncmVlbiUyMGhvcml6b250YWx8ZW58MHx8MHx8fDA%3D"
                          )
                        }
                        objectFit="cover"
                        quality={100} // Optional: controls the image quality
                      />
                    </div>
                    <div className="bg-cover bg-center h-26 w-36 rounded-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1472376758045-62f519fc676d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmF0YXVyJTIwdmVydGljYWx8ZW58MHx8MHx8fDA%3D"
                        alt="Profile Picture"
                        width={1000}
                        height={500}
                        className="cursor-pointer  rounded-lg"
                        onClick={() =>
                          setImageUrl(
                            "https://images.unsplash.com/photo-1472376758045-62f519fc676d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bmF0YXVyJTIwdmVydGljYWx8ZW58MHx8MHx8fDA%3D"
                          )
                        }
                        objectFit="cover"
                        quality={100}
                      />
                    </div>
                    <div className="bg-cover bg-center h-26 w-36 rounded-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1691137716347-02932ba769dd?w=1000&auto=format&fit=crop&q=100"
                        alt="Profile Picture"
                        width={1000}
                        height={500}
                        className="cursor-pointer rounded-lg h-24"
                        onClick={() =>
                          setImageUrl(
                            "https://images.unsplash.com/photo-1691137716347-02932ba769dd?w=1000&auto=format&fit=crop&q=100"
                          )
                        }
                        objectFit="cover"
                        quality={100}
                      />
                    </div>
                  </div>

                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>

              {openPsmodal && <ChangePassword />}
            </div>
          )}
          {isClicked == 2 && <UserProfile />}
          {isClicked == 3 && <Payment />}
          {isClicked == 4 && <Blogs />}
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};
export default withProtectedRoute(ProfilePage);
