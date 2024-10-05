import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  FaHome,
  FaUser,
  FaUsers,
  FaEnvelope,
  FaImage,
  FaLock,
  FaUnlock,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { FaMoneyBillWaveAlt } from "react-icons/fa";
import Cookies from "js-cookie";

const AdminNav = () => {
  const router = useRouter();

  const handlogout = () => {
    try {
      Cookies.remove("access_Admin_token"); 
      localStorage.removeItem("jwtToken");
      router.replace("/admin/adminLogin");
    } catch (error) {
      console.log(error);
    }
  };

  const pathname = usePathname();

  const currentLink = (path: string) =>
    pathname === path ? "bg-blue-600" : "";

  return (
    <div>
      <header className="px-4 h-16 backdrop-blur-lg border-b border-neutral-700/80 flex justify-between items-center">
        <div className="flex items-center flex-shrink-0 ">
          <span className="text-xl tracking-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out hover:from-purple-700 hover:to-blue-700">
            ProCo
          </span>
        </div>

        <nav className="flex justify-around items-center p-6 w-[45rem]">
          <Link href="/admin/dashboard">
            <div
              className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${
                currentLink("/admin/dashboard")
                  ? "bg-gray-900"
                  : "bg-transparent"
              }`}
            >
              <FaHome className="text-white text-2xl" />
            </div>
          </Link>

          <Link href="/admin/PaymentManagement">
            <div
              className={`flex items-center space-x-2 ${
                currentLink("/admin/PaymentManagement")
                  ? "bg-gray-900"
                  : "bg-transparent"
              } p-2 rounded-md`}
            >
              <FaMoneyBillWaveAlt   className="text-white text-2xl cursor-pointer" />
            </div>
          </Link>
          <Link href="/admin/usermanagement">
            <div
              className={`flex items-center space-x-2 ${
                currentLink("/admin/usermanagement")
                  ? "bg-gray-900"
                  : "bg-transparent"
              } p-2 rounded-md`}
            >
              <FaUser className="text-white text-2xl cursor-pointer" />
            </div>
          </Link>

          <Link href="/admin/promanagement">
            <div
              className={`flex items-center space-x-2 ${currentLink(
                "/admin/promanagement"
              )     ? "bg-gray-900"
              : "bg-transparent"} p-2 rounded-md`}
            >
              <FaUsers className="text-white text-2xl cursor-pointer" />
            </div>
          </Link>

          <Link href="/admin/reqmanagement">
            <div
              className={`flex items-center space-x-2 ${currentLink(
                "/admin/reqmanagement"
              )     ? "bg-gray-900"
              : "bg-transparent"} p-2 rounded-md`}
            >
              <FaEnvelope className="text-white text-2xl cursor-pointer" />
            </div>
          </Link>

          <Link href="/admin/blogmanagement">
            <div
              className={`flex items-center space-x-2 ${currentLink(
                "/admin/blogmanagement"
              )     ? "bg-gray-900"
              : "bg-transparent"} p-2 rounded-md`}
            >
              <FaImage className="text-white text-2 xl cursor-pointer" />
            </div>
          </Link>
        </nav>
        <div className="flex justify-end" onClick={handlogout}>
          <MdLogout size="24px" />{" "}
        </div>
      </header>
    </div>
  );
};

export default AdminNav;
