"use client";
import LeftSideBar from "@/components/home/LeftSideBar";
import Navbar from "../components/home/Navbar";
import withProtectedRoute from "./protectedRoute";
import Pricing from "@/components/landing/Pricing";
import useStore from "@/store/user";

const home = function Home() {
  const { payment } = useStore();

  return (
    <div>
      <Navbar />
      {payment ? <Pricing /> : <LeftSideBar />}
    </div>
  );
};

export default withProtectedRoute(home);
