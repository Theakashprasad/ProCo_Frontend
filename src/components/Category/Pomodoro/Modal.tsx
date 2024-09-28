import { useEffect } from "react";
import PropTypes from "prop-types";
import animationData from "../../../assets/abc.json";
import Lottie from "lottie-react";
import useStore from "@/store/user";

const Modal = ({ open, onClose }) => {
  const { setVideo } = useStore();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const videoUrls = [
    "https://pomodo.s3.eu-north-1.amazonaws.com/aesthetic+anime+car+shorts+loop+_+youtube+shorts+_+gif+loop+%23shorts+(1).mp4",
    "https://pomodo.s3.eu-north-1.amazonaws.com/84574-586228759.mp4",
    "https://pomodo.s3.eu-north-1.amazonaws.com/167659-837413029.mp4",
    "https://pomodo.s3.eu-north-1.amazonaws.com/179352-861813091.mp4",
  ];
  return (
    <div
      onClick={onClose}
      className={`
        fixed inset-0 flex justify-center items-center transition-colors duration-300 h-full 
        ${open ? "visible bg-black/20" : "invisible bg-transparent"}
      `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
           rounded-xl shadow p-6 transition-all duration-300 transform w-1/2 h-1/2 border-[0.1rem] border-black 
          ${open ? "scale-100 opacity-95" : "scale-75 opacity-0"}
        `}
        style={{
          background: "linear-gradient(to right, #530061, #0D0A30)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-gray-100"
        >
          close
        </button>

        <div className="text-center flex ">

        <div className="w-1/4">
  <div className="text-white text-cente text-xl font-mono w-2/3">settings </div>

  <div className="h-full text-start pt-10 space-y-5">
    <button className="w-2/3 h-10 rounded-xl bg-black bg-opacity-20 backdrop-blur text-blur text-sm ">image</button>
    <br />
    <button className="w-2/3 h-10 rounded-xl bg-black bg-opacity-50 backdrop-blur text-blur text-sm">video</button>
    <br />
    <button className="w-2/3 h-10 rounded-xl bg-black bg-opacity-20 backdrop-blur text-blur text-sm">ambiens</button>
  </div>
</div>
{/* self closing div, used for margin */}
<div className="bg-white w-1 mr-10"/>
          {/* INNER CONTENT */}
          <div className="h-80 w-2/3 opacity-100 ">
            <div className="h-full grid grid-cols-3 pt-10 gap-5 ">
              <div
                className="bg-black w-32 h-28  rounded-xl bg-cover flex justify-center items-center"
                onClick={() => setVideo(videoUrls[0])}
              >
                {/* <img src={A} alt="Example" className="w-full "/> */}
              </div>
              <div
                className="bg-black w-32 h-28  rounded-xl flex justify-center items-center"
                onClick={() => setVideo(videoUrls[1])}
              >
                <img
                  src="/A.png"
                  alt="Example"
                  className="w-full "
                />
              </div>
              <div
                className="bg-black w-32 h-28  rounded-xl flex justify-center items-center"
                onClick={() => setVideo(videoUrls[2])}
              >
                <img
                  src="/b.png"
                  alt="Example"
                  className="w-full "
                />
              </div>
              <div
                className="bg-black w-32 h-28  rounded-xl flex justify-center items-center"
                onClick={() => setVideo(videoUrls[3])}
              >
                <img
                  src="/c.png"
                  alt="Example"
                  className="w-full "
                />
              </div>
            </div>
          </div>

          <div className="w-40 mx-auto absolute right-0 bottom-0">
            <Lottie animationData={animationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
