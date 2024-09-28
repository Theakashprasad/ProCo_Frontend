"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faShare } from "@fortawesome/free-solid-svg-icons";
import { GoFileMedia } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import { Avatar, Typography, Card, CardContent } from "@mui/material";
import useUser from "@/Hook/useUser";
import {
  useRef,
  useState,
  ChangeEvent,
  MouseEvent,
  FormEvent,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import useStore from "@/store/user";
import Image from "next/image";
//crop
import React, { useCallback } from "react";
import Cropper from "react-easy-crop";
// import { Area } from "react-easy-crop/types";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

type props = {
  refreshBlogs: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const BlogPost = ({ setIsModalOpen, refreshBlogs  }: props) => {
  const { user } = useUser();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [about, setAbout] = useState<string>("");
  const [email, setEmail] = useState<string | undefined>();
  const { image } = useStore();
  //crop

  const [images, setImages] = useState<File[]>([]);
  const [croppedImages, setCroppedImages] = useState<Map<number, string>>(
    new Map()
  );
  const [croppingIndex, setCroppingIndex] = useState<number | null>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any | null>(null);
  const [croppedFiles, setCroppedFiles] = useState<Map<number, File>>(new Map());

  useEffect(() => {
    if (user) {
      setEmail(user?.email);
    }
  }, [user]);

  //crop
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  //
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newImages = Array.from(selectedFiles);
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  //crop
  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    // const image = new Image();
    // image.src = imageSrc;
    const image = new window.Image();
    image.src = imageSrc;
    return new Promise<string>((resolve) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = pixelCrop.width;
          canvas.height = pixelCrop.height;

          ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
          );

          resolve(canvas.toDataURL("image/jpeg"));
        }
      };
    });
  };
  const handleCropImage = async () => {
    if (croppingIndex !== null && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(
        URL.createObjectURL(images[croppingIndex]),
        croppedAreaPixels
      );
  
      const croppedFile = await fetch(croppedImage)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new File([blob], `cropped_image_${croppingIndex}.jpg`, {
              type: 'image/jpeg',
            })
        );
  
      setCroppedImages((prev) => new Map(prev).set(croppingIndex, croppedImage));
      setCroppedFiles((prev) => new Map(prev).set(croppingIndex, croppedFile));
      setCroppingIndex(null);
    }
  };
  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setCroppedImages((prevCropped) => {
      const newCropped = new Map(prevCropped);
      newCropped.delete(index);
      return newCropped;
    });
  };
  //
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAbout(e.target.value);
  };

  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email ?? "");
    formData.append("about", about);

    // images.forEach((file, index) => {
    //   formData.append('file', file);
    // });
  
    // Append the cropped images
    croppedFiles.forEach((file, index) => {
      formData.append('cropped_image', file);
    });
   
    try {
      console.log("formData", images);
      const response = await axios.post(
        `${BASE_URL}/api/pro/blogPost`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setIsModalOpen(false);
        toast.success("POST ADDED", {
          position: "top-center",
        });
        refreshBlogs(); // Call the refreshBlogs function after successful post
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
    }
  };

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation(); // Prevents closing when clicking inside the modal
  };

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
    };

  return (
    <div
      className="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="relative bg-zinc-700 p-6 rounded-lg shadow-lg w-1/2 h-2/3"
        onClick={handleModalClick}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 px-4 py-2  rounded-lg hover:bg-red-600"
        >
          <IoMdClose />
        </button>
        <div className="flex">
          <h1 className="text-white font-semibold text-lg">ADD POST</h1>
        </div>
        <div>
          <input
            className="w-full h-52 p-2 mt-6 border rounded-lg bg-zinc-700"
            placeholder="What do you want to talk about"
            value={about}
            onChange={handleInputChange}
          />
        </div>
        <div className="h-48 flex gap-6">
          <input
            type="file"
            ref={fileRef}
            onChange={handleFileChange}
            hidden
            multiple
            accept="image/*" // Specify accepted file types
            className="p-2 border border-black rounded-lg bg-white"
          />
          <div className="my-8 bg">
            <GoFileMedia
              onClick={() => fileRef.current?.click()}
              className="w-10 h-10 cursor-pointer hover:bg-gray-800"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {/* crop */}
          <div className="grid grid-cols-2 gap-4 pt-10">
            {images.map((image, index) => (
              <div key={index} className="w-full h-64 relative">
                {croppingIndex === index ? (
                  <div className="absolute inset-0 z-10">
                    <Cropper
                      image={URL.createObjectURL(image)}
                      crop={crop}
                      zoom={zoom}
                      aspect={2}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                    <button
                      className="absolute bottom-2 left-2 bg-blue-500 text-white p-2 rounded"
                      onClick={handleCropImage}
                    >
                      Crop
                    </button>
                  </div>
                ) : (
                  <>
                    <Image
                      src={
                        croppedImages.has(index)
                          ? croppedImages.get(index)!
                          : URL.createObjectURL(image)
                      }
                      alt={`Preview ${index}`}
                      className="object-cover w-48 h-28 cursor-pointer"
                      onClick={() => setCroppingIndex(index)}
                      width={50}
                      height={50}
                    />
                    <button
                      className="absolute top-0 bg-slate-500 hover:bg-red-500 text-white p-1 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <IoMdClose />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* <div className="grid grid-cols-2 gap-4  absolute bottom-2">
          {[...croppedImages.values()].map((croppedImage, index) => (
            <Image
              key={index}
              src={croppedImage}
              alt={`Cropped ${index}`}
              className=" w-48 h-28"
              width={croppedAreaPixels?.width || 100}  // Example width, adjust as needed
              height={croppedAreaPixels?.height || 100} // Example height, adjust as needed
            />
          ))}
        </div> */}
        {/* crop */}
        <div className="border-gray-500 border-b-2" />
        <button
          onClick={handleSubmit}
          className="absolute bottom-4 right-5 px-4 py-1 bg-blue-500 text-white rounded-3xl"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default BlogPost;
