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
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import withProtectedRoute from "@/app/protectedRoute";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface User {
  achievements: string;
  email: string;
  _id: string;
  fullname: string;
  Profession: string;
  request: boolean;
  subProfession: string;
}

const RighBarUser = () => {
  const [user, setUser] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [uniqueProfessions, setUniqueProfessions] = useState<string[]>([]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [proForSub, setProForSub] = useState<User[]>([]);
  const [selectedSubProfession, setSelectedSubProfession] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`${BASE_URL}/api/pro/user`);
        console.log(res.data.data);
        setUser(res.data.data);
        // user for the filter part
        if (res.data.data) {
          const professions = res.data.data.map(
            (item: User) => item.Profession
          );
          const uniqueProfessions = professions.filter(
            (value: any, index: any, self: string | any[]) =>
              self.indexOf(value) === index
          );
          setUniqueProfessions(uniqueProfessions);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchData();
  }, [setUser, setUniqueProfessions]);

  const handleSelectedProfession = (e: any) => {
    const SelectedProfessionVal = e.target.value;
    setSelectedProfession(SelectedProfessionVal);

    const professionUsers = user.filter((data) =>
      data.Profession.includes(SelectedProfessionVal)
    );
    setProForSub(professionUsers);
    setSelectedSubProfession("");
  };

  return (
    <div>
      <Card className=" mb-4 shadow-lg rounded-lg ">
        <CardContent className="bg-[#0d0d0d] text-white min-h-screen">
          <div className="flex justify-between items-center mb-4 w-full px-10">
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
            <div className=" flex ">
              <div className="">
                <select
                  className="w-44 border border-purple-700 rounded-lg bg-[#0d0d0d]"
                  value={selectedProfession}
                  onChange={handleSelectedProfession}
                >
                  <option key="default" value=""></option>
                  {uniqueProfessions.map((data, i) => (
                    <option key={i} value={data}>
                      {data}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <select
                  className="w-20 border border-purple-700 rounded-lg bg-[#0d0d0d]"
                  value={selectedSubProfession}
                  onChange={(e) => setSelectedSubProfession(e.target.value)}
                >
                  <option key="default" value=""></option>
                  {proForSub.map((data, i) => (
                    <option key={i} value={data.subProfession}>
                      {data.subProfession}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {user
            .filter(
              (data) =>
                data.request == true &&
                data.fullname.includes(searchQuery) &&
                (selectedSubProfession
                  ? data.subProfession?.includes("EEE")
                  : data.Profession?.includes(selectedProfession))
            )
            .map((user) => (
              <div
                key={user._id} // Using user._id as the unique key
                className="flex items-center bg-[#1b1b1b] hover:bg-zinc-950 rounded-lg p-4 w-2/3 ml-10 mt-3 h-28"
              >
                <Image
                  src="data:image/jpeg;base64,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"
                  alt="profile picture"
                  width={70}
                  height={70}
                  className="rounded-full mr-4"
                />
                <div className=" w-full flex justify-between items-center">
                  <div className="text-left">
                    <Typography className="uppercase">
                      {user.fullname}
                    </Typography>
                    <Typography className="!text-sm text-gray-400">
                      Profession: {user.Profession}
                    </Typography>
                  </div>
                  <div className="bg-blue-400 hover:bg-blue-700 px-4 py-1 rounded-xl">
                    <Link href={`/profile/${encodeURIComponent(user?.email)}`}>
                      view
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
};

// export default RighBarUser;
export default withProtectedRoute(RighBarUser);
