import { useState } from "react";
import Modal from "./Modal";
import RotatingIcon from "./Setings";
import Center from "./Center";
import useStore from "@/store/user";

Center
const PomoMain = () => {
  const [open, setOpen] = useState(false);
  const { video } = useStore();
 

  return (
    <div className="relative w-full h-screen text-white">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={video}
        autoPlay
        muted
        loop
      />

      {/* Content */}
      <div
        className={`relative w-full h-screen flex flex-col justify-between transition-all ${
          open ? "blur-md" : ""
        }`}
      >
  <div className="h-40 flex items-center justify-between px-4">
      <div>{""}</div>
      <div className="relative flex justify-around w-[25rem] text-lg ">
        <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
          pomodoro
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
        </button>
        <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
          timer
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
        </button>
        <button className="font-sans relative group transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">
          stopwatch
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 group-hover:scale-x-100"></span>
        </button>
      </div>
    </div>
        <Center />
        <div className="flex justify-between w-full px-4 pb-4">
          <div>  
            <button className="btn btn-danger" onClick={() => setOpen(true)}>
            <RotatingIcon/>
            </button>
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default PomoMain;
