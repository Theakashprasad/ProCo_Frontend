import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { IoMdClose } from "react-icons/io";

type CropImageProps = {
  imageSrc: string;
  onSave: (croppedImage: File) => void;
  onCancel: () => void;
};

const CropImage = ({ imageSrc, onSave, onCancel }: CropImageProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    if (!croppedAreaPixels) return;
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const { width, height, x, y } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        image,
        x,
        y,
        width,
        height,
        0,
        0,
        width,
        height
      );
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], 'cropped-image.jpeg', {
            type: 'image/jpeg',
          });
          resolve(croppedFile);
        }
      }, 'image/jpeg');
    });
  };

  const handleSave = async () => {
    const croppedImage = await getCroppedImg();
    if (croppedImage) {
      onSave(croppedImage);
    }
  };

  return (
    <div className="crop-container relative">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={4 / 3}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
      />
      <button onClick={onCancel} className="absolute top-2 right-2">
        <IoMdClose size={24} />
      </button>
      <button onClick={handleSave} className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-2 rounded">
        Save
      </button>
    </div>
  );
};

export default CropImage;
