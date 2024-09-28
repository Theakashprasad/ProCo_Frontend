"use client";
import { ChangeEvent, useCallback, useState } from "react";
import ImageCropper from "../../components/Blog/ImageCropper";
import FileDropZone from "../../components/Blog/FileDropZone";
import AppSlider from "../../components/Blog/AppSlider";
import { BiCloudDownload } from "react-icons/bi";
import { z } from "zod";
import axios from "axios";
import useStore from "@/store/user";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg"];
const imageSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: `Supported file types are ${ALLOWED_IMAGE_TYPES.join(", ")}.`,
    }),
});

export default function CropImage() {
  const [remoteImage, setRemoteImage] = useState("");
  const [localImage, setLocalImage] = useState("");
  const [zoom, setZoom] = useState(1);
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const [rotation, setRotation] = useState(0);
  const { setImage, setModal } = useStore();
const router = useRouter()
  const isImageSelected = remoteImage || localImage ? true : false;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setRemoteImage("");
    const file = acceptedFiles[0];
    const validationResult = imageSchema.safeParse({ file });

    if (!validationResult.success) {
      alert('ONLY IMAGE ARE ALLOWED');
      return;
    }

    setLocalImage(URL.createObjectURL(file));
  }, []);

  const handleOnZoom = useCallback((zoomValue: number) => {
    setZoom(zoomValue);
  }, []);

  const handleOnRotation = useCallback((rotationValue: number) => {
    setRotation(rotationValue);
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;

    const validationResult = imageSchema.safeParse({ file });
    if (!validationResult.success) {
      alert(validationResult.error.errors[0].message);
      return;
    }

    setRemoteImage("");
    setLocalImage(URL.createObjectURL(file));
  };
  const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  const uploadImage = async () => {
    if (!croppedImage) return;
console.log(croppedImage);
setImage(croppedImage)
setModal(true)
const formData = new FormData();
formData.append("email", "email@gmail.com");
formData.append("about", "about");
formData.append("images", croppedImage);
const response = await axios.post(
  `${BASE_URL}/api/pro/blogPost`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' }
  }
);
// router.replace('/')
    // const formData = new FormData();
    // formData.append("image", croppedImage, "cropped-image.png");
  };  

  if (!isImageSelected)
    return (
      <div className="space-y-4 w-full p-4">
        <input
          className="w-full p-2 rounded border-2 border-gray-300 focus:border-gray-700 outline-none focus:outline-none transition"
          placeholder="https://images.unsplash.com/photo-1691673236501..."
          value={remoteImage}
          onChange={({ target }) => {
            handleFileChange
            setLocalImage("");
            setRemoteImage(target.value);
          }}
        />
        {/* <input type="file" accept="image/*" onChange={} /> */}
        <FileDropZone onDrop={onDrop} />
      </div>
    );

  return (
    <div className="flex">
      <div className="space-y-4 w-96 p-4">
        <input
          className="w-full p-2 rounded border-2 border-gray-300 focus:border-gray-700 outline-none focus:outline-none transition"
          placeholder="https://images.unsplash.com/photo-1691673236501..."
          value={remoteImage}
          onChange={({ target }) => {
            setLocalImage("");
            setRemoteImage(target.value);
          }}
        />

        <FileDropZone onDrop={onDrop} />

        <AppSlider
          min={0}
          max={360}
          defaultValue={0}
          value={rotation}
          label="Rotate"
          onChange={handleOnRotation}
        />

        <AppSlider
          min={1}
          max={3}
          value={zoom}
          label="Zoom"
          defaultValue={1}
          onChange={handleOnZoom}
        />

        <button
          className="flex items-center justify-center p-2 bg-gray-400 hover:bg-gray-700 transition rounded space-x-1 uppercase text-white w-full drop-shadow"
          onClick={uploadImage}
        >
          <BiCloudDownload size={24} />
          <span>Upload</span>
        </button>
      </div>

      <div className="h-screen p-4 flex-1 flex items-center justify-center">
        <ImageCropper
          zoom={zoom}
          onZoomChange={handleOnZoom}
          rotation={rotation}
          onRotationChange={setRotation}
          source={remoteImage || localImage}
          onCrop={setCroppedImage}
          width={1920}
          height={1080}
        />
      </div>
    </div>
  );
}
