"use client";

import useStore from "@/store/user";
import { Typography } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import { IoMdClose } from "react-icons/io";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const UserProfile = () => {
  const { followId } = useStore();
  const [followerData, setFollowerData] = useState<any[]>([]);
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  // this id the data of professional ( verfy )
  const [proData, setProData] = useState<any>();
  console.log("user", user);
  // console.log("followerData", followerData);
  // console.log("proData", proData);

  useEffect(() => {
    const getData = async () => {
      try {
        const senterId = user._id;
        const res = await axios.get(
          `http://localhost:3005/api/pro/connectionFindPro/${senterId}`
          ,{withCredentials:true});
        console.log("res.data.data",res.data.data);
        setFollowerData(res.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [followId, user]);

  // useEffect(() => {
  //   async function userData() {
  //     try {
  //       const responses = await axios.post(`${BASE_URL}/api/pro/emailCheck`, {
  //         email: user.email,
  //       });
  //       setProData(responses.data.data);
  //     } catch (error) {
  //       console.log("erroe form the userData", error);
  //     }
  //   }
  //   userData();
  // }, [setProData, user]);

  // const handleReq = async (action: string, userId: string) => {
  //   const follow = action;
  //   // const res = await axios.post(
  //   //     `http://localhost:3005/api/pro/connection/${userId}/${follow}`
  //   //   );
  //   const senterId = userId;
  //   const receiverId = proData?._id;
  //   console.log("senterId", senterId, "and", "receiverId", receiverId);
  //   setFollowerData((prevData) =>
  //     prevData.map((follower) =>
  //       follower.senterId._id === userId
  //         ? { ...follower, follow: action }
  //         : follower
  //     )
  //   );
  //   const res = await axios.post(
  //     `http://localhost:3005/api/pro/connection/${senterId}/${follow}/${receiverId}`
  //   );
  //   console.log(res);

  //   console.log(`${action} request triggered for user ID: ${userId}`);
  //   // Add the logic for accepting or rejecting the request
  // };

  return (
    <div className="w-3/4 ml-8">
      <div className="p-8 rounded-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5">
        <div className="bg-cover bg-center h-10 w-full rounded-lg text-white text-center text-lg font-semibold">
          CONNECTIONS
        </div>
        {followerData && followerData.length > 0 ? (
          followerData.map((user, i) => (
            <div
              key={i}
              className="flex items-center  bg-gray-400  backdrop-blur-lg bg-opacity-5 rounded-lg p-4 w-2/3 ml-10 mt-3"
            >
              <Image
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxASEBAQEQ4NEA8REhAQEBIPEA8PEA8QFREWFhURFRUYHSggGBolGxUTITEhJTUrLi4uGB8zRDMtOCgtLisBCgoKDg0NDw8PDysZFRktKysrKys3LSsrKy0rLTcrKzcrKysrLSsrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAABQECBAYHA//EADwQAAIBAQQGBwYEBQUAAAAAAAABAgMEESExBQZBUWFxEiIygZGhwRMjQlJysYKS0fAHU2Jj4RQkRJPS/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAEREv/aAAwDAQACEQMRAD8A7iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUbAqCl5UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFJSSV7aS4mJabco4RxfkiPqVZSd7bfoXESFXSEV2U5eSMWdum9qXJGMC4LpVJPOUnzbLQAgXRm1lJrk2i0AZELbNbb+eJk0tIL4k1xWKI4DFTtOomr001wLiChNp3ptPgZ9mt9+E8OOzv3Ew1nAIEUAAAAAAAAAAAAAAAAAAFGyNtdsv6scI7Xv/wAC3Wq/qrsrN73+hhlkQABUAAAAAAAAAAAAAGTZbW4YPGO7dyJWEk1enemQJkWO09B3PsvPhxJYqXBRMqRQAAAAAAAAAAAAAMPSFo6K6KzfkjLlJJNvJYkHVqOUnJ7fLgWItABUAAAAAAGLb9IUqMelVmop5LOUuSWLNdtOuiv93QbW+pNR8kn9yjbAajR10x69nw3wnj4NepsGjdLUa693O+SxcJdWce71WAGcACAAAAAAz9HWj4H+H9CQIGMmmms1iibo1OlFS3/clWLwARQAAAAAAAAAAYek6l0VH5n5L9ojDJ0hO+b4XL1MY1EAAEAAAI7TelI2en03jN4U4/NLe+C2/wCSROc6y291rRPHqU26cN10Xi+93vwKMC12qdWbqVJOU3texbkti4HiAVAvpVZRkpRk4yi7007mmWADoWrmmlaINSuVaC66WCkvnXru7yZOX6Ltro1oVVf1X1kvig+0vD0OnxaaTTvTxT3oiqgAgAAAZ+i6mce9evoYB62Wd04vjd44CqmgAZUAAAAAAAAAABbUgmmnk8CDnBptPNYE8YOkaF/XWztct5Y+7lu/hsP0Y0j0oAAAAAAMn/AGXj10LSldL03I2/J3oKlY0Thqtv6XXE8pNU8nHqcZ5VsRa+MQ8MwNZak9UcfmppRzng+rGqKAAKgAAOloq0alTK41rmty0NDT0jfh2ru/uooiZZ4JWrtRqf3+xdWtrvbltxfEMHfUaaafNfihNOaxrkiAKgAAAAAAP//Z"
                alt="profile picture"
                width={50}
                height={50}
                className="rounded-full mr-4"
              />
              <div className="w-full flex justify-between items-center">
                <div className="text-left flex items-center space-x-3">
                  <h1 className="text-lg">
                    Username: 
                  </h1>
                  <span className="text-sm text-gray-300">{user.receiverId.fullname}</span>
                </div>

                <div className="px-4 py-1 rounded-xl flex space-x-2 font-semibold">
                  {user.follow == "accept" && (
                    <span className="text-green-400">Accepted</span>
                  )}
                  {user.follow == "reject" && (
                    <span className="text-red-400">Rejected</span>
                  )}
                  {user.follow == "new" && (
                    <span className="text-blue-400">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No connections fountytyd.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
