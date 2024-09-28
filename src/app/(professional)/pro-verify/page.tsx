"use client";
import { proVerfySchema } from "@/Types/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";

//Ths is used as a base url for the backed req
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function Pro_verify() {
  const [storedEmail, setStoredEmail] = useState('');
  useEffect(() => {
    let storedEmail = localStorage.getItem("ProEmail") ?? "";
    if (storedEmail) {
      setStoredEmail(storedEmail);
    }
  }, []);

  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof proVerfySchema>>({
    resolver: zodResolver(proVerfySchema),
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error && error.message) {
          toast.error(error.message, { position: "top-left" });
        }
      });
    }
  }, [errors]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleChange = async (data: z.infer<typeof proVerfySchema>) => {
    console.log(storedEmail);

    const formData = new FormData();
    formData.append("fullname", data.fullname);
    formData.append("Profession", data.Profession);
    formData.append("subProfession", data.subProfession);
    formData.append("working", data.working);
    formData.append("achievements", data.achievements);
    formData.append("country", data.country);
    formData.append("about", data.about);
    formData.append("file", data.file);
    formData.append("Linkedin", data.Linkedin);
    formData.append("email", storedEmail);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/pro/proVerify`,
        formData
      );

      if (response.data.success) {
        Cookies.remove("access_token"); // Replace 'authToken' with the name of your cookie
        router.replace("/standBy");
        toast.success("REQUEST SENT", {
          position: "top-center",
        });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("file", file, { shouldValidate: true });

      // Create a URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="bg-white lg:bg-gradient-to-b from-purple-700 to-purple-900 p-6 w-full lg:w-1/6  flex flex-col items-center">
        <div className="relative group w-6 rounded-full bg-white text-black text-center font-extrabold">
          i
          <div className="absolute top-0 left-0 lg:left-32 hidden group-hover:block bg-gray-700 text-white p-2 rounded-md shadow-xl w-64 text-center z-50">
            <p className="font-mono text-pretty text-sm">
              This page is to provide necessary information about your
              profession. Please fill in the form. After admin verification, you
              will gain access to the site.
            </p>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-8 bg-white flex-1 flex justify-center items-center">
        <div className="bg-white rounded-lg p-8 w-full max-w-5xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-black">VERFICATION</h1>
          </div>
          <form className="space-y-5" onSubmit={handleSubmit(handleChange)}>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 lg:w-1/2">
              <div className="flex-1">
                <label
                  htmlFor="Name"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Name
                </label>

                <input
                  type="text"
                  className={`w-full p-2 border rounded-lg bg-white ${
                    errors.fullname ? "border-red-500" : "border-black"
                  }`}
                  placeholder="User name"
                  {...register("fullname")}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row  space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="profession"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Profession
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border border-black rounded-lg bg-white ${
                    errors.Profession ? "border-red-500" : "border-black"
                  }`}
                  placeholder="Profession"
                  {...register("Profession")}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row  space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="profession"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Sub Profession
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border border-black rounded-lg bg-white ${
                    errors.subProfession ? "border-red-500" : "border-black"
                  }`}
                  placeholder="sub Profession"
                  {...register("subProfession")}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10">
              <div className="flex-1">
                <label
                  htmlFor="working"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Working
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border border-black rounded-lg bg-white ${
                    errors.fullname ? "border-red-500" : "border-black"
                  }`}
                  placeholder="Working"
                  {...register("working")}
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="achievements"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Achievements
                </label>
                <input
                  type="text"
                  className={`w-full p-2 border border-black rounded-lg bg-white ${
                    errors.achievements ? "border-red-500" : "border-black"
                  }`}
                  placeholder="Achievements"
                  {...register("achievements")}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-10 lg:w-1/2">
              <div className="flex-1">
                <label
                  htmlFor="country"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  country
                </label>
                <select
                  className="w-full p-2 border border-black rounded-lg bg-white"
                  {...register("country")}
                >
                  <option value=""></option>
                  <option value="India">India</option>
                  {/* Add city options here */}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="working"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Add documents
              </label>
              <input
                type="file"
                ref={fileRef}
                hidden
                className="p-2 border border-black rounded-lg bg-white"
                onChange={handleFileChange}
              />
              <div className="flex items-center space-x-4">
                <Image
                  src={
                    imagePreview
                      ? (imagePreview as string)
                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOQAAADdCAMAAACc/C7aAAAAaVBMVEXDw8MAAADGxsaXl5fJycnMzMxSUlKRkZF1dXV5eXnCwsIFBQWlpaV+fn66urqurq5dXV1sbGxMTEyKiopXV1czMzOcnJwaGhqoqKiEhIQlJSUrKysODg5mZmZHR0ezs7M7OzsVFRU5OTmFwHepAAAC+klEQVR4nO3bi1KjMBSAYXIarIbea2uttVXf/yE36Q0qobrITHP0/2Z2Zt2xDP+GQEDMMgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANQ56dCtY+JcZge9zgzsrXvipGc61EtzLO29KbpKLMx9mkPpI83H410XFiblyGFufy7Ph0lHPnSya/aByFuqRv7sSqchUvwV83k4EHFtt6QhcrwOl4GXZdv9VBApq3CdK/w1c9nykNUQ+XK6pG/abin5SFmWy5Z+u6FMP7K6unttt6cKIqflSE4a9tQd/zRtKflI6ZeRw6Y9deFS2ryl5COzUXkzMWoIcZm45bixUkGkfd6PormyyBMZPxkzaVouKIjM7PAwjtPm/XRP4Rse8/hgaoh0djzdbl9XeePJxc7CUBdmHi/REOkPx3Bb2DTlnOwP6L34vNQReZ3szqffRXRa/oJIcetzpJnksS2pj3T5pPrIqmfr6wL9kbZvynWf/8uuPi21Rzrxa4WijCzMW/0j6iKdV/lSZPH5Ges0V3+4flqi+uV77Ql07QmCtkg7GlcumM4uI0/ZC+UjGe67FpVl+qhWGGw/f0pRpIS99aeWjTtV2rdopBleTktNkZkMwvmzMHf20BCaY42FWV3MXFWR2eZY8ezvpY/N8aF8UhuZz84jtV+Iu/d4YfiGu+oHFUX6e43i1LDODs1FfCT9P8+lXN7piZRxNWOS23nTOB7syvsRPZHZ+qKhv2uckMfBLqelmsjLew1/anlpOlbLwT5vSUeks/2rQVG9U5eSyLC0+f+3JE53XToiRT6+OjhjPjRFunz6dVHM9DAtVURG7zW+ZbAfSw2R0mpCHvi1vFMRabctC/1/zdaKisjTTwnaRIYfhCmIdHbQunF/Rl5J8pEizfca37Pxkzr5yNnXHdfNJPGRHNrRvP9D81HqkbnNO5D2W5K//X1XFyK7kuyby3/iHXTp8rcJVmk2/onfCwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALi1f4DsKck70eEzAAAAAElFTkSuQmCC"
                  }
                  alt="Profile Picture"
                  width={50}
                  height={50}
                  className={`w-36 cursor-pointer p-2 border border-black rounded-lg bg-white ${
                    errors.fullname ? "border-red-500" : "border-black"
                  }`}
                  onClick={() => fileRef.current?.click()}
                />
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="working"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Linkedin
              </label>
              <input
                type="text"
                className={`w-full p-2 border border-black rounded-lg bg-white ${
                  errors.Linkedin ? "border-red-500" : "border-black"
                }`}
                placeholder="Linkedin"
                {...register("Linkedin")}
              />
            </div>
            <div>
              <label
                htmlFor="about"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                About
              </label>
              <input
                className={`w-full h-36 p-2 border border-black rounded-lg bg-white ${
                  errors.about ? "border-red-500" : "border-black"
                }`}
                placeholder="About"
                {...register("about")}
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="py-2 px-4 bg-purple-700 text-white rounded hover:bg-purple-800"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
