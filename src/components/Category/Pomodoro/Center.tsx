import { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { IoMdPause } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Center = () => {
  const [time, setTime] = useState(15); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const totalTime = 15; // Total time in seconds (25 minutes)
  

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTime(totalTime);
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  const progress =  (time / totalTime) * 100;
const size = 310
const strokeWidth = 10
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center h-full mb-10">
        <div className="text-center text-white relative w-80 h-80 "> 
        <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#05cdfa"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        fill="none"
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

    </svg>
          <div className="absolute bottom-[14%] right-[15%] w-60 h-36 text-3xl">
            <span className="text-5xl">
            <i className="fas ">{formatTime()}
            </i></span>
            
            <div className=" h-10 mt-8 space-x-5 text-lg">
            <button className="" onClick={toggleTimer}>{ isActive?<IoMdPause/> : <FaPlay /> }</button>
            <button onClick={resetTimer}><GrPowerReset /></button>
            </div>
           
          </div>
        </div>
        <div className="text-white h-8 w-1/2 flex justify-around mt-16 items-center bg-white rounded-xl bg-opacity-[5%] backdrop-blur-lg shadow-lg">
          <button className=" transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">focus</button>
          <button className=" transition-transform duration-300 hover:scale-110 hover:translate-y-[-5px]">break</button>          
        </div>
      </div>
    </div>
  );
};

export default Center;
