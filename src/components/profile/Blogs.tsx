"use client";

import axiosInstance from "@/lib/axios";
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Typography, Card, CardContent } from "@mui/material";
import { FaRegUserCircle } from "react-icons/fa";
import { format } from "date-fns";
import { IoMdCloseCircle } from "react-icons/io";
import Image from "next/image";
import { toast } from "sonner";

const Blogs = () => {
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [userId, setUserId] = useState(initialUserState);
  const [blogs, setBlogs] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    const blogData = await axiosInstance.get(
      `/api/pro/getblogSave/${userId._id}`
    );
    setBlogs(blogData.data.data.blogId);
  },[userId._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, setBlogs]);

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
  const handleRemove = async (blogId: string) => {
    const blogData = await axiosInstance.patch(
      `/api/pro/removeBlogSave/${userId._id}/${blogId}`
    );    
    fetchData()
    toast.success("SUCCESSFULLY REMOVED", {
        position: "top-center",
      });
  };
  console.log("asdf", blogs);

  return (
    <div className="w-3/4 ml-8">
      <div className="bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-5 p-8 rounded-lg">
        {blogs
          // .filter((val) => val.block === false)
          .map((val: any) => (
            <Card key={val._id} className="mb-4 !bg-black">
              <CardContent className="bg-[#0d0d0d] text-white rounded-lg">
                <div className="flex justify-between">
                  <div className="flex items-center mb-4">
                    <FaRegUserCircle className="w-14 h-14 ml-4" />
                    <div className="ml-4">
                      <span className="font-bold text-lg">
                        {val.email.replace("@gmail.com", "")}
                      </span>
                    </div>
                    <Typography className="text-gray-400 mb-2  pl-5 !text-xs">
                      {val?.updatedAt
                        ? format(
                            new Date(val?.updatedAt),
                            "MMMM dd, yyyy • HH:mm"
                          )
                        : "Date not available"}
                    </Typography>
                  </div>
                  <div>
                    <IoMdCloseCircle
                      onClick={() => handleRemove(val._id)}
                      className="text-2xl cursor-pointe hover:text-slate-400"
                    />
                  </div>
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
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default Blogs;
