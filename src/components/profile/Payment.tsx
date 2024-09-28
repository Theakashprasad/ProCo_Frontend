import axios from "axios";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import Pricing from "../landing/Pricing";
import { MdOutlineMessage } from "react-icons/md";
import { BsCameraVideoFill } from "react-icons/bs";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface User {
  payment: string;
  paymentDate: string;
}

interface UserData {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report: number;
  isBlocked: boolean;
  role: string;
  // Add more fields as needed
}

const Payment = () => {
  const [payment, setPayment] = useState<User | null>(null);
  const [currentPayDate, setCurrentPayDate] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);

  const [user, setUser] = useState<UserData | null>();
  useEffect(() => {
    const storedUserDetail = localStorage.getItem("userDetail");
    if (storedUserDetail) {
      const initialUserState = storedUserDetail
        ? JSON.parse(storedUserDetail)
        : null;
      setUser(initialUserState);
    }
  }, [setUser]);


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.post(
          `${BASE_URL}/api/userDataMain`,
          { email: user?.email },
          { withCredentials: true }
        );
        setPayment(res.data.userData || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [user]);

  // useEffect(() => {
  //   const userData = async () => {
  //     try {
  //       const res = await axios.post(`${BASE_URL}/api/pro/emailCheck`, {
  //         email: user?.email,
  //       });
  //       setProData(res.data.data);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   userData();
  // }, [user]);

  useEffect(() => {
    if (payment?.paymentDate) {
      const currentDate = new Date(payment.paymentDate);

      const formattedCurrentDate = currentDate.toISOString().split("T")[0];
      const expirationDate = new Date(currentDate);
      expirationDate.setDate(expirationDate.getDate() + 30);
      const formattedExpirationDate = expirationDate
        .toISOString()
        .split("T")[0];

      setCurrentPayDate(formattedCurrentDate);
      setExpirationDate(formattedExpirationDate);

      console.log("Current Date:", formattedCurrentDate);
      console.log("Expiration Date:", formattedExpirationDate);
    }
  }, [payment]);

  return (
    <div className="w-3/4 ml-8">
      <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5 p-8 rounded-lg">
        <div className="bg-cover bg-center h-10 w-full rounded-lg text-white text-center text-lg font-semibold">
          PAYMENT
        </div>
        {payment && payment?.payment ? (
          <div>
            <h1 className="font-semibold underline uppercase text-sm">
              Benefits -
            </h1>
            <div className="flex justify-center gap-20 pt-10">
              <div>
                <MdOutlineMessage className="w-20 h-20" />
              </div>
              <div>
                <BsCameraVideoFill className="w-20 h-20" />
              </div>
            </div>
            <div>
              <span className="">
                Current subscription:{" "}
                <p className="text-green-400">{currentPayDate}</p>
              </span>
              <br />
              <span>
                Expire subscription:{" "}
                <p className="text-red-400">{expirationDate}</p>{" "}
              </span>
            </div>
            <div className="pt-10">
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="flex">
                    <TiTick className="w-8 h-8 text-green-400" />
                    Unlimited video call
                  </span>
                </li>
                <li className="flex">
                  <TiTick className="w-8 h-8 text-green-400" />
                  <span>Unlimited message</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div>
            <Pricing />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
