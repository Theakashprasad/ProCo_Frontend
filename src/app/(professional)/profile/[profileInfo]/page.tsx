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
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useRouter } from "next/navigation";
import Connection from "@/components/profile/Connection";
import useStore from "@/store/user";
import { IoIosChatbubbles } from "react-icons/io";
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
  _id: string;
  fullname: string;
  Profession: string;
  subProfession: string;
  about: string;
  achievements: string;
  country: string;
  email: string;
  imageUrl: string;
  working: string;
  Linkedin: string;
}

type Props = {
  params: {
    profileInfo: string;
  };
};

type Chat = {
  fullName?: string;
  email?: string;
  receiverId?: string;
};

interface proUserData {
  _id: string;
}
const ProfilePage = ({ params }: Props) => {
  const socialIcons = [
    { icon: <FaFacebookSquare />, name: "facebook" },
    { icon: <FaInstagram />, name: "instagram" },
    { icon: <CiYoutube />, name: "youtube" },
  ];
  const [isEditing, setIsEditing] = useState(false);
  const fileReOfBg = useRef<HTMLInputElement | null>(null);
  const fileRefOfUser = useRef<HTMLInputElement | null>(null);
  const [age, setAge] = useState(0);
  const [userData, setUserData] = useState<Profile | null>();
  //email from the custome hook
  const { user } = useUser();
  const [email, setEmail] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<User>();
  const router = useRouter();
  const { setFollowId } = useStore();
  const [proData, setProdata] = useState<proUserData>();
  const [connectionData, setConnectionData] = useState<any>();
  //this information is form the local storage
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [usersDatas, setUsersDatas] = useState(initialUserState);
  const [connectionIsThere, setConntectionIsThere] = useState(false);
  const { premimum } = useStore();

  // useEffect(() => {
  //   if (params) {
  //     const emailVal = decodeURIComponent(params.profileInfo as string);
  //     setEmail(emailVal);
  //   }
  // }, [params]);

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
    let emailVal = "";
    if (params) {
      emailVal = decodeURIComponent(params.profileInfo as string);
      setEmail(emailVal);
    }

    async function userData() {
      try {
        const responses = await axiosInstance.post("/api/pro/emailCheck", {
          email: emailVal,
        });

        // const responses = await axios.post(`${BASE_URL}/api/pro/emailCheck`, {
        //   email: emailVal,
        // });
        setUserData(responses.data.data);
        const Prodata = await axiosInstance.post("/api/proData", {
          email: email,
        });
        // const Prodata = await axios.post(
        //   `${BASE_URL}/api/proData`,
        //   {
        //     email: email,
        //   },
        //   { withCredentials: true }
        // );

        setProdata(Prodata.data.data);

        const senterId = usersDatas?._id;
        console.log(senterId);

        const res = await axios.get(
          `http://localhost:3005/api/pro/connectionFindUser/${senterId}`
        );
        // const hasReceiverId = res.data.data.some((item: { receiverId: any; }) => item.receiverId === responses.data.data._id);
        console.log("res.data.data", res.data.data);
        const matchingData = res.data.data.filter(
          (item: { receiverId: any }) =>
            item.receiverId === responses.data.data._id
        );
        console.log("matchingData", matchingData[0].follow);
        setConnectionData(matchingData[0].follow);

        if (matchingData.length && matchingData[0].follow !== "new")
          setConntectionIsThere(true);
      } catch (error) {
        console.log("erroe form the userData", error);
      }
    }
    userData();
  }, [email, setUserData, params, setConnectionData]);

  // useEffect(() => {
  //   if (Object.keys(errors).length > 0) {
  //     Object.values(errors).forEach((error) => {
  //       if (error && error.message && Object.keys(errors).length == 5) {
  //         toast.warning(error.message, { position: "top-left" });
  //       } else {
  //         toast.error(error.message, { position: "top-left" });
  //       }
  //     });
  //   }
  // }, [errors]);

  // const handleChange = async (data: z.infer<typeof profileSchema>) => {
  //   const formData = new FormData();
  //   formData.append("profession", data.profession);
  //   formData.append("education", data.education);
  //   formData.append("age", age.toString());
  //   formData.append("about", data.about);
  //   formData.append("file", data.file);
  //   formData.append("gender", data.gender);
  //   formData.append("email", email ?? "");
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/api/userProfile`,
  //       formData,
  //       { withCredentials: true }
  //     );
  //     if (response.data.success) {
  //       toast.success("SUCCESS", {
  //         position: "top-center",
  //       });
  //       setIsEditing(false);
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       toast.error(
  //         error?.response?.data.message ||
  //           "An error occurred. Please try again.",
  //         {
  //           position: "top-left",
  //         }
  //       );
  //     } else {
  //       console.log("An unexpected error occurred:", error);
  //     }

  //     console.log(error);
  //   }
  // };
  const [isConnect, setIsConnect] = useState(false);
  const handleConnection = async () => {
    setIsConnect(true);

    const follow = "new";
    //user id
    const senterId = usersDatas._id;
    // professional id
    const receiverId = userData?._id;
    const res = await axios.post(
      `http://localhost:3005/api/pro/connection/${senterId}/${follow}/${receiverId}`
    );
    toast.success("REQUEST SENT", {
      position: "top-center",
    });
  };
  const [isClicked, setIsClicked] = useState(1);

  const handleChat = () => {
    if (usersDatas.payment || premimum  ) {
      router.push(`/connect/${proData?._id}`);
    } else {
      toast.warning("PREMIUM MEMBER ONLY", { position: "top-left" });
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-white p-5">
      <div className="container mx-auto py-5">
        <div className="flex justify-between items-center mb-8">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              <MdOutlineKeyboardBackspace />
            </button>
          </div>{" "}
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-xl tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
                ProCo
              </span>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="w-1/4">
            <div className="bg-zinc-800 p-4 rounded-lg pb-10">
              <h2 className="text-lg font-semibold mb-4 text-blue-500">
                Other profiles
              </h2>

              {user?.isPro ? (
                <div className="space-y-2">
                  {/* CHAT */}
                  <div>
                    <button
                      onClick={() => setIsClicked(1)}
                      className="w-full text-left text-white bg-gray-700 p-2 hover:bg-slate-400 rounded-md focus:outline-none flex justify-between items-center "
                    >
                      CHAT
                    </button>
                  </div>
                  {/* FOLLOW */}
                  <div>
                    <button
                      onClick={() => {
                        setFollowId(userData?._id);
                        setIsClicked(2);
                      }}
                      className="w-full text-left text-white bg-gray-700 p-2 hover:bg-slate-400 rounded-md focus:outline-none flex justify-between items-center "
                    >
                      CONNECTION
                    </button>
                  </div>
                  {/* payment */}
                  <div>
                    <button
                      onClick={() => setIsClicked(3)}
                      className="w-full text-left text-white bg-gray-700 p-2 hover:bg-slate-400 rounded-md focus:outline-none flex justify-between items-center "
                    >
                      PAYMENT
                    </button>
                  </div>
                </div>
              ) : (
                "on work"
              )}
            </div>
          </div>

          {isClicked == 1 && (
            <div className="w-3/4 ml-8">
              <form>
                <div className="bg-zinc-800 p-8 rounded-lg">
                  <div className="flex items-center mb-6">
                    <input
                      type="file"
                      ref={fileReOfBg}
                      hidden
                      className="p-2 border border-black rounded-lg bg-white"
                      // onChange={handleFileChange}
                    />
                    <div className="bg-cover bg-center h-44 w-full rounded-lg">
                      <Image
                        // src="https://i.pinimg.com/236x/c9/36/5d/c9365d2bd2b7bff2b7e3a8f1cb6a0dff.jpg"
                        src="https://images.unsplash.com/photo-1619551964399-dad708b59b8b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvcml6b250YWwlMjB3YWxscGFwZXJ8ZW58MHx8MHx8fDA%3D"
                        alt="Profile Picture"
                        width={50}
                        height={50}
                        className="h-44 w-full cursor-pointer  border-black rounded-lg bg-white"
                        onClick={() => fileReOfBg.current?.click()}
                        priority
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
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEX///82NjY3NzczMzMvLy/8/PwmJiYsLCw6OjoqKioeHh4kJCQAAAAfHx8aGhr5+fnt7e3x8fGXl5fDw8Pa2tq3t7dsbGxQUFB4eHjU1NQVFRXJyclhYWERERHh4eHn5+eysrKkpKSQkJBVVVVBQUFJSUmhoaGRkZGGhoZ7e3txcXFnZ2dSUlJbWltjYmMbN5fgAAAPQklEQVR4nO1diZaiOhCFVAg7yKaNiqCirfby/5/3WFxAQ8uSfsQ5fefMOTO9QK5JKlWVWgThD3/4wx/+8AqQsj9/eHEsYkH4t+cxTvfxP01QEDwDpmt/coFj/1N8Hd8WhMRSzciI5vO5putY2S2P78kq+/q/sXbDmesJ/lJEChJFhJCiYCxiVZvLH+vJ2INjA/sQGQZk1NAVYs5VBNnYJfbYwxuIOHhTCEaKCIBqBPPZzDjLRHdfdSIlSXCCL2ypBRMAENEjsq+BruxfVPI46511nbnLrNEgmp/+2IPtg0XGLxcuV4IX3P03A2B9/3pSda9DCbENwDo5UoaxR90Bh7nYll2OTBKJ8QtNoy3sNeVhLf6ETBhh45U24yrC0JFhxtFavc4sTtUOK7RkmC1qNXVe5fj3I6UHQwTzZOyRt8VG7khQLJc0eRt75C0xwV3EaIUhLF9kHyZWR35XqNvkFRS4SddNeAMGTZlwL20Wn1jsyzBbqOpsbALP4Mm4y0F4TxBAD8am8CMkX4d7TbsjRTHl27+qYPRgTHScRG0hcCxu3jWKudQR8nFsFo2QhDiSxcEMIXXGZtIESXB1VM7hAIKiGK3GZtII56v/MVGB6XEralYRC4KiuhmbSCMCjQlDzK8CfiBMGKrTsYk04iQzYShPud2HjBjij7GJNOINM2EIp7GJNGLDZh/Kh7GJNGKtM2GoumMTacSCzWmh8Ws/raJh6loJFPHrGo4tBgQzhvHYRBoRqywYinN+GU4UJpo38HspbM9YMIQdt/ahIExZHPmw5NifeGChtmF+VRpJ2LAQNZlKw6viLQguC7VNdjlmmJgMRI25Fvi90A9738ncgKyA43A3Jo6aXGnjlqFjDFdMkeFwvErtiMEqjWyeGbI48QnPDCUGahtObcHml+IRBm9EmOZxjXxSlPbLHQOG6dLlUzGVstMQXyMsBzAEmIdjk2nAXruFkA5hqBBeXVFvMlzDZPszzCDzenFxVFnMYcmQS0EjvJG7YPV+QIrK6xxuTCYMRYXweoGYWAxEaT6JJq8u4ZCJuzQDt6eFbylMCCKLV6f3JGXh1M+1Gm4dph9s7g9Vfm9ID2y8+jq/94cek9u1wlHDKWKTBUNR4/dmxtmy2Ih4y/G9BROft8rvNmRzzY20xdg0foBtwYAY7xKgcbxICxNxKENujcMSXtQ65bABiPB7VhRQuufL1AEwNoUnWGma2p+hIquZnOHTvr8iThLcdxYVsl6HPAfqC+Wdkb2VezIsjAqO/d1XHPuuU5XfG/w61n1tfbIfe+gtsep7x8ZxGkIddl8FnOdQoTo2uI/DBmGeVe46QqMXw7k39sBbw+51ICoa/8fEFb0ih15okWbStE9MRsSzXfiAXXeCoPCukNbQI/zLfJXjvoTdWXFD8sschiVcveNO5Nr/RMOkq79G5fU2phEb0uXUR+TVprCsHdF+GgH8l5KkBT66mPr4y3ZejaH92WUO0Y7bK8NGTNIuJhQor2Ia3rCCLiELQF5OlAo+UboEZZi8Bic0I7Q6HfnWCzKcd3J+a/zWUWhCxxvvPMli7CF3giTsO+k0IuE5FYgGSTjInRiqp5djOO2keQNevhzDboVcAM9ejKEgfHZjCLuxB9wRkrDryDB9Nc3b6Zr0jF9NMV119dOor6bUhF1jh8yX8pZmWHT1emuvc2lRonOYovnvM1yPPeSO6MzwXPLyBcIUJCEM8/qCuKMwlfPTwg8EPtPWbsimYG8Ucn9tKJQK+g1AKCr8pf6c15yuK6R4S6B0uayjDl6MqLyWmaQm8HzyZ1soIDKk5yDmRG9bl12JzmLG/gLZWgucZqtng4pPlojEz8tWCsx2GaUQJZeHTDECa8mr/9tOFDWvrL68fmXRylOD8a2IwjQvYYuJy+FNm71yZ1YRWwqVfBAfPXcLY7Vy1r/hsmlJ+r7iS6iGm52hAio6dtRqAjpPPd9YufmCJeEoF35kBXQjPXCg5RTHsxS8RZZcVoDO57BeQMfZ/aSgQqpXS+pKwka+espBNY1pMnrXq1Ww1Ez50i+nKFZdZyjZS9IsbhCZTWrjrzDMk0lB12bJOMdHEUca7reg44JWJcH5vgiS/WY1XCUiRfuw6zPk6rW+V9lfILBzwxEkzyQ8bFUNi+eJqzJ8iLXfmIguVMnUviue4JpIqVAsAKKu7Q7h/3n9JjnecRcRUG60Kr2cKDVy95pIc55qjzfbNIb580Gep6cgd+X8foy0NEmmJCrjnOkMKQXH19rjHIJG0UGpDC8kLe20/r0+iuf94rtbQ5PrcRYXudA8h5IQREip/w5YCcWOyBlS+RW/hME0sk1ZPpI18i5q3oEYcvP5dh4KppYLWMzrP4zpXotiDu/7l1XmPVMozCg6euwkz/VTXnlTbKr5WfxMEaMWlMusRvmmpGb/IB7V2H03lWeNojKdQtbJMggvTx6GYhROuP+SdQzt6sk3lcyLlYoeTkKBWoJmoz5lKJaakynPNgsG8tVeee9vM1Mv23IMYihMthcPo5zHJVAZHuTnrzi3c8NY03anQ+L3X7GSELuzTGPBtw5xDxuDxrAxE9sp1RtQZ41psG9y22ixciZlohu7Te9eX3uiYlEBYMQwO92Lgt942XymHVtn912GpShAomMvQyRGBJUaS0eG3w0PlATpo2D4ZTfWgZq2Tii6DKtUevp0pcsjDVD1UW0ZwrLRI3gq7Qzz815ZqzBsSfAyrEJ1zew2o2PWolRUQOxXAwI+m5bModRskKhOm5rlLLvnopQqVedbgViRexIUYdYg3FwdLmNqbLC27J27CHK3y6tptziD2qsa6nYE16qR2bqK9tQ5lAY0OZG/2tOzBc9M++dk0z2egXH9gXwr39xrVTjdbo7rr9Xad2uVhDQTMr0rsRCfIkaqmfqFsIoCyniGlMtGoLa3rDxzSKEZjeLuDKvnXCmODYpoWA2qOqEnbQnmRasHUNQft3yMKnNTHjgI5Mec5nBQcwW8a71Mo0HVkLRHhjtS6NN1o4gg6d6+GFZpSmldkD8wh0whrXlDUqhHd3ZtZuPfH/zhoLoa0PKWVeqfqVyCVm2tTA2uEdQ3j8ZdMKhaNshNCuM9yKAppB1MtuRq9ebqIjlSNs1xWH0bMNoZjItoYEU5ame493ltDiOqVrPDrUzQRoYtk8E36sCiZBY1NGY9rzA0qSkyvtopNvyRodwqod9Jh9aRbSg/mlwdx6JK/6wDbRhDEZltDH5/aLOYxjjDt0uJWpjRfRjfA+cwk6bPLQxJeFfbWIE/MjSpmqlPLu7/PMSLQtFRO+VoUIBkmvy6p/gxtIwsgE49l5YYLvKUPokBGfbi7Mxv098kVgdK0pxjSptCA12McqRQkw9O6lCGSJw/d2cEGovS+JRz6fPqDMlJKJRXRwMXT2FbPw/IYdH/DumPpppniBWGyEwe3pxYgxnmjrxnBIfYoFcA3t2ZapL9hatziDB62DAfsjKcIYjProxDBos0m6zo3r7wLFRjiPT7JBnHAAZz+DyK02XS/g7uG/xJ3yDWGcLnXRuLPbl8b8ib0dNyb92SCBoZglhfhOEc3TFERl2c5jmnLBhimhyvLhXqdXQPimbdDXOSK+MuGd5lyYSRyIQhPEl7X7Bo9lMM9Ls2QbtqEN9ZdcM1f84BM5lDEWnJjwyvXtvBMP2K6zumjLqWGCvFeHBJyTOe2Be7rqG9jaiVEPDVR9MW1RJj18w+WlB/IuhQYib6vkip6DW0lFmlmmEhbQfXzLzix6Rpj00z2BxIrzikQsonh6ruzQW7j1YkyT2tClw2LYsL4O1NkHg0hur7dQaFKbCR4flzf2y2y6TS8QWVy6A9pUh09Wxe4SKMhslrEVg/MDSeP6A95FsDcVpLclRRks+BQoxebDTbiD6DpmIVzCfXRUhbG3h2ea9NRIYMmyueS8K6W5WAZzinGBQps7QDMb18O9GHn/QVNPeElhjVxb8A4YtXm9oGClL7zHCHQGRHUIRGG9FmYRtWoMyDCwXqg1FpykmhUXg32L3YbIokcFh0L6wA8Fc5hRP69y868hsW2Z33ORqrhHqsuqickRnCJQeffgjppVIzMRiu0AIUF0mJTO0eWKr6Hucjj55Qeql1uVHPd4vMXoubeg0dZNYMQSsSQzxCHX550eikLJwX9dd+0N3C9iewZnhuN+LRfbC54zg7okyROUORfuZPLPYMyy7iCaGGdhQKpD3DwMDwrWNOv0dcWayM0BuQlp/67/SkkiKK0ctVVsaSRmxoIJFozPT7CvJj/dSg0Odq2wyLLE/7Eg1tzQ7qbzDMO4zN6N9CkIlZVfkFhg0uxRNmvOELwM4WGj653N+wBMSeYaZq0LQa+2vo7R0duicQ+v4GU/J1VIShsH1lJi5pkTWxwlxqF5BnQlP0ijkp1g37VZpHnlFEqawyVSwuQNaiwYEHJJgXyQcs31oEbhN6bzpnDURm5k28AZpMFgQKYswQZQ9UNXnfGP7lTQ19eEffBzRkiWSjKSMTWKqkurHM1d3m23xn/WkQ/AuLlYJzkgqz50EqRzv3eViU5G/SaFhk2xhAgOfo4Evtioc44ZuSJy+z1+J+DXgunrxOaVCxN03NXxA7vwJM4DuI87v0LhSzmVxMZULYq8UsASLCujxNevcTdLyDNjcHxUT/KkCNjI6Ls44isyV0t4aVr1eOliyCTPfEeiY5CzNJGtJBKf9VyUneUNS3idNvALAckeO6rFYgSY2JYu0Ylr/r+O8f2FJzt+bwBoADoGTsVAuW73n+6JUXo7xnOw4PX6KmjydhkSKrc9geF7FdbCHGCd3lilgtNp+gkdxo/7/FD9aJkrHLdWpJGrg0n8BZ7LfZ6+T8soG97+oRSAFCVHnrlpnNv03vsjZWiZtGhkWGN62kcbqWN8lLKRhGekjCilT5ZYZVxIG7VOcWOU8kK7K5TVUcB5ahfbnJiOXaiwI8trNwD0uYW7qaW5cDd2dhwGJVn2fy8uB6E26aIUrOxF8fT1vFjEyCIQ9ZV1CnSUVF9R6iRaY8mx73i9gpygv9X6uxLezY94PN6WubAtFNnchPu5IWWfUqMTVTVnZf08N64cdnl3yhbHBG8IaJHy4W+8P0a5cqYsZAJxlfQvQSJEf+CagYpens++gGi4U/uVkGXHN7hLMKPc8LvCBYr/eu6+7X6yQJguxr4WryOjSokHKd+MlPnPX7P/zhD3/4A8/4D5LO7YojpuNDAAAAAElFTkSuQmCC"
                        alt="Profile Picture"
                        width={50}
                        height={50}
                        className="h-24 w-24 bg-cover bg-center  cursor-pointer p-2 border border-black rounded-full bg-white"
                        onClick={() => fileRefOfUser.current?.click()}
                        priority
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-2xl font-bold uppercase">
                        {userData?.fullname}
                      </h2>
                      <p className="text-gray-400">
                        {userData?.Profession ? userData.Profession : ""}
                      </p>
                    </div>
                    {user?.isPro ? (
                      ""
                    ) : connectionIsThere ? (
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded-full transition-colors duration-300 flex items-center"
                        type="button"
                        onClick={handleChat}
                      >
                        <IoIosChatbubbles className="mr-2" /> Chat        
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`text-white px-4 py-2 rounded-xl ${
                          isConnect || connectionData === "new"
                            ? "bg-gray-500"
                            : "bg-green-500"
                        }`}
                        onClick={handleConnection}
                      >
                        <span>
                          {" "}
                          {isConnect || connectionData == "new"
                            ? "REQUESTED"
                            : "CONNECT"}{" "}
                        </span>
                      </button>
                    )}

                    {/* 
                  {isEditing ? (
                    <button
                      type="submit"
                      className=" text-white px-4 py-2 rounded"
                    >
                      <TiTick className="w-8 h-8 text-blue-400" />
                    </button>
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
                  )} */}
                  </div>
                  <div className="text-white">
                    <div className="container mx-auto ">
                      <div className="bg-[#2e2d2e] p-8 rounded-lg mb-6">
                        <div className="flex justify-between gap-5 ">
                          <div>
                            <h3 className="font-semibold">Profession</h3>
                            {isEditing ? (
                              <input
                                type="text"
                                className="bg-[#343434] rounded-lg"
                                placeholder="sd"
                                {...register("profession")}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.Profession
                                  ? userData.Profession
                                  : ""}
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">Working</h3>
                            {isEditing ? (
                              <select
                                className="w-52 p-2 h-7 bg-[#343434] rounded-lg"
                                {...register("gender")}
                              >
                                <option value=""></option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                {/* Add city options here */}
                              </select>
                            ) : (
                              <p className="text-gray-400">
                                {userData?.working ? userData.working : ""}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <h3 className="font-semibold">Country</h3>
                            {isEditing ? (
                              <input
                                type="text"
                                className="bg-[#343434] rounded-lg"
                                placeholder="sd"
                                {...register("education")}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.country ? userData.country : ""}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <h3 className="font-semibold">Achievements</h3>
                            {isEditing ? (
                              <input
                                type="date"
                                className="bg-[#343434] rounded-lg"
                                placeholder="sd"
                                onChange={calculateAge}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.achievements
                                  ? userData.achievements
                                  : ""}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="font-semibold">Linkedin</h3>
                            {isEditing ? (
                              <input
                                type="date"
                                className="bg-[#343434] rounded-lg"
                                placeholder="sd"
                                onChange={calculateAge}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.Linkedin ? userData.Linkedin : ""}
                              </p>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">Sub Profession</h3>
                            {isEditing ? (
                              <input
                                type="date"
                                className="bg-[#343434] rounded-lg"
                                placeholder="sd"
                                onChange={calculateAge}
                              />
                            ) : (
                              <p className="text-gray-400">
                                {userData?.subProfession
                                  ? userData.subProfession
                                  : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#2e2d2e] p-8 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">ABOUT</h3>

                        {isEditing ? (
                          <input
                            type="text"
                            className="bg-[#343434] rounded-lg w-full h-20"
                            placeholder="sd"
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
          )}
          {isClicked == 2 && <Connection />}
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
