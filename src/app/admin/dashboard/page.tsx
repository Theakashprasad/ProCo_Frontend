"use client";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdLogout } from "react-icons/md";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  fullname: string;
  email: string;
  isVerified: boolean;
  report:number;
  isBlocked:boolean;
  // Add more fields as needed
}
const DashBoard = () => {
  
  const [users, setUsers] = useState<User[]>([]); // Initialize users state with empty array of type User[]
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // console.log('sdsdsd',users[0]);

  useEffect(() => {
    const updatauser = async () => {
      const res = await axios.post("http://localhost:3005/api/user");
      setUsers(res.data.data);
    };
    updatauser();
    setReload(false);
  }, [reload]);
  const handlogout = () => {
    try {
      // await fetch("/api/auth/signout");
        router.replace("/adminLogin");
      } catch (error) {
      console.log(error);
    }
  };

  //  const handleDeleteAccount = async (userId) => {
  //   console.log(userId);

  //   try {
  //     const res = await fetch(`/api/admin/delete/${userId}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     if (data.success === false) {
  //       console.log('sometig went wrong');
  //       return;
  //     }else{
  //       setReload(true)
  //     }
  //     // dispatch(deleteUserSuccess(data));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const handleAction = async (userId: string, isBlocked: boolean) => {
    try {
      const action = isBlocked ? 'unblock' : 'block';
      const res = await axios.post(`http://localhost:3005/api/block/${userId}/${action}`);
      console.log(action,typeof userId);
      toast.error( `user has been ${action}`, {  
        position: "top-center",
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    }  catch (error) {
      console.log(error);
      
      // console.error(${isBlocked ? 'Unblock' : 'Block'} action failed for user ${userId}:, error);
    }


  };
  return (
    <div className="p-4 border-2 border-gray-200 dark:border-gray-700 mt-14">
      <h1 className="flex justify-center font-bold text-3xl underline">
        USER MANAGEMENT
      </h1>
      {/* <Link to='/admin/create'>
      <button className="bg-blue-700 text-white p-2  rounded-lg uppercase hover:opacity-80 disabled:opacity-80">
        create user
      </button>
      </Link> */}
      <div className="flex justify-end" onClick={handlogout}>
        <MdLogout size="24px" />{" "}
      </div>
      <div className="flex justify-center border-l-neutral-950 pt-6"></div>
      <div className="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10 pt-11">
         <div className="flex justify-between items-center pb-4">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full max-w-md"
          />
          </div>
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-100">
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Name
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Email
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Report
              </th>
              <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
          {users.filter((data) => data.email.includes(searchQuery)).map((user) => (
              <tr key={user._id}>
                <td className="py-4 px-6 border-b border-gray-200 text-black">
                  {user.fullname}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 truncate text-black">
                  {user.email}
                </td>
                <td className="py-4 px-6 border-b border-gray-200 truncate text-black">
                  {user.report}
                </td>
                <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => handleAction(user._id, user.isBlocked)}
                  className={`bg-${user.isBlocked ? 'green' : 'red'}-500 text-black font-bold py-2 px-4 w-36 rounded`}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
                </button>
        </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashBoard;
