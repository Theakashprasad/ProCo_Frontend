"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Avatar, Typography, Card, CardContent } from "@mui/material";
import useUser from "@/Hook/useUser";
import BlogPost from "../Blog/BlogPost";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { format } from "date-fns";
import { FaRegUserCircle } from "react-icons/fa";
import { toast } from "sonner";
import { CiSaveDown2 } from "react-icons/ci";
import { MdReport } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import axiosInstance from "@/lib/axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const RightSideBar = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
  const [currentLikedUsers, setCurrentLikedUsers] = useState([]);
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [userData, setUser] = useState(initialUserState);

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const fetchBlogs = async (page: number) => {
    try {
      console.log("kasjfksadfjaskdlf");

      const response = await axios.get(`${BASE_URL}/api/pro/Allblogs`);
      console.log(response.data.data);

      if (response.data.data.length === 0) {
        setHasMore(false);
      } else {
        setBlogs((prevBlogs) => [...prevBlogs, ...response.data.data]);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  const refreshBlogs = () => {
    setBlogs([]);
    setHasMore(true);
  };

  const handleLikeClick = async (email: string, _id: string) => {
    const blog = blogs.find((blog) => blog._id === _id);
    const isLiked = blog.like.includes(user?.email);

    const updatedLikes = isLiked
      ? blog.like.filter((like: string | undefined) => like !== user?.email)
      : [...blog.like, user?.email];

    const updatedlikedByUsers = isLiked
      ? blog.likedByUsers.filter(
          (user: { fullname: string }) => user.fullname !== userData.fullname
        )
      : [...blog.likedByUsers, { fullname: userData.fullname }];

    isLiked
      ? toast.error("unLikE", {
          position: "top-center",
        })
      : toast.success("Like", {
          position: "top-center",
        });

    try {
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b._id === _id
            ? { ...b, like: updatedLikes, likedByUsers: updatedlikedByUsers }
            : b
        )
      );
      await axios.post(`${BASE_URL}/api/pro/blogLike`, {
        blogId: _id,
        userEmail: user?.email,
        action: isLiked,
      });
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  // State to manage the current image index for each blog post
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  // Handler to go to the next image
  const goToNextImage = (blogId: string) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[blogId] ?? 0;
      const totalImages =
        blogs.find((blog) => blog._id === blogId)?.image.length || 1;
      return { ...prev, [blogId]: (currentIndex + 1) % totalImages };
    });
  };

  // Handler to go to the previous image
  const goToPrevImage = (blogId: string) => {
    setCurrentImageIndex((prev) => {
      const currentIndex = prev[blogId] ?? 0;
      const totalImages =
        blogs.find((blog) => blog._id === blogId)?.image.length || 1;
      return {
        ...prev,
        [blogId]: (currentIndex - 1 + totalImages) % totalImages,
      };
    });
  };

  const modalRef = useRef<HTMLDialogElement>(null);
  const openModal = (likedUsers: any) => {
    setCurrentLikedUsers(likedUsers);
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleSave = async (blogId: string) => {
    console.log("user id", blogId);
    const data = {
      userId: userData._id,
      blogId: blogId,
    };
    const responses = await axiosInstance.post("/api/pro/blogSave", data);
    console.log(responses.data.success);
    if (responses.data.success) {
      toast.success("SAVED", {
        position: "top-center",
      });
    } else {
      toast.error("ALREADY SAVED", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      {user?.isPro && (
        <div className="pb-5">
          <div className="bg-[#0d0d0d] h-36 flex p-10 gap-10 items-center rounded-xl">
            <Avatar
              src="https://i.pinimg.com/236x/c9/36/5d/c9365d2bd2b7bff2b7e3a8f1cb6a0dff.jpg"
              alt="avatar"
              style={{ width: "70px", height: "70px" }} // Adjust size as needed
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="border w-1/2 h-14 rounded-3xl hover:bg-slate-900"
            >
              Start post
            </button>
          </div>
        </div>
      )}
      <InfiniteScroll
        dataLength={blogs.length}
        next={() => setPage((prevPage) => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more blogs</p>}
      >
        {blogs
          .filter((val) => val.block === false)
          .map((val: any) => (
            <Card key={val._id} className="mb-4 !bg-black">
              <CardContent className="bg-[#0d0d0d] text-white rounded-lg">
                <div className="flex justify-between">
                  <div className="flex items-center mb-4">
                    <FaRegUserCircle className="w-14 h-14 ml-4" />

                    <div className="ml-4">
                      <span className="font-bold text-lg">
                        {val.authorDetails.fullname}
                      </span>
                      <Typography
                        variant="subtitle2"
                        className="text-gray-400 !text-xs"
                      >
                        {val.authorDetails.Profession}
                      </Typography>
                    </div>
                    <Typography className="text-gray-400 mb-2 pb-4 pl-5 !text-xs">
                      {val?.updatedAt
                        ? format(
                            new Date(val?.updatedAt),
                            "MMMM dd, yyyy • HH:mm"
                          )
                        : "Date not available"}
                    </Typography>
                  </div>
                  {!user?.isPro && (
                    <div>
                      <CiSaveDown2
                        onClick={() => handleSave(val._id)}
                        className="text-2xl cursor-pointe hover:text-slate-400"
                      />
                    </div>
                  )}
                </div>
                <Typography className="py-4 text-sm leading-relaxed pl-5 border-t border-t-gray-600">
                  {val.about}
                </Typography>

                <div className="relative p-4 rounded-lg mb-4 h-[30rem] flex justify-center w-full">
                  {val.image.length > 0 && (
                    <Image
                      src={val.image[currentImageIndex[val._id] ?? 0]}
                      width={1000}
                      height={100}
                      priority
                      alt="Picture of the author"
                    />
                  )}
                  {val.image.length > 1 && (
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                      onClick={() => goToPrevImage(val._id)}
                    >
                      &lt;
                    </button>
                  )}
                  {val.image.length > 1 && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                      onClick={() => goToNextImage(val._id)}
                    >
                      &gt;
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4 mb-4 text-gray-400">
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`cursor-pointer w-6 pl-4 ${
                      val.like.includes(user?.email) ? "text-green-500" : ""
                    } hover:text-red-500 text-2xl`}
                    onClick={() => handleLikeClick(val.email, val._id)}
                  />
                  <Typography
                    onClick={() => openModal(val.likedByUsers)}
                    className="!text-sm text-white cursor-pointer"
                  >
                    {val.like.length} likes
                  </Typography>
                </div>
                <dialog id="my_modal_1" className="modal " ref={modalRef}>
                  <div className="modal-box w-60">
                    <h3 className="font-bold text-lg ">LIKES</h3>
                    {val.likedByUsers.length > 0 && (
                      <div className="pl-10 text-gray-500">
                        <table className="min-w-full">
                          <tbody>
                            {currentLikedUsers.map(
                              (
                                user: { fullname: string; email: string },
                                index: number
                              ) => (
                                <tr key={index}>
                                  <td className="flex items-center px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-sm leading-5 text-white">
                                    <FaRegUserCircle className="mr-2 h-6 w-6" />
                                    {user.fullname}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="modal-action">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Close</button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </CardContent>
            </Card>
          ))}
      </InfiniteScroll>

      {isModalOpen && (
        <BlogPost refreshBlogs={refreshBlogs} setIsModalOpen={setIsModalOpen} />
      )}
    </div>
  );
};

export default RightSideBar;
