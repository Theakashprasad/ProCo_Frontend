// "use client";
// import React, { use, useEffect, useState } from "react";
// import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
// import { ImCross } from "react-icons/im";
// import { useRouter } from "next/navigation";
// import useStore from "@/store/user";
// import axiosInstance from "@/lib/axios";

// type Props = {
//   params: {
//     Roompage: string;
//   };
// };

// const Room = ({ params }: Props) => {
//   const { communityId } = useStore();
//   const [roomId, setRoomId] = useState<string | null>(null);
//   const storedUserDetail = localStorage.getItem("userDetail");
//   const initialUserState = storedUserDetail
//     ? JSON.parse(storedUserDetail)
//     : null;
//   const [user, setUser] = useState(initialUserState);
//   const router = useRouter();
//   // useEffect(() => {
//   //   if (params && params.Roompage) {
//   //     const val = decodeURIComponent(params.Roompage);
//   //     setRoomId(val);
//   //   }
//   // }, [params]);

//   useEffect(() => {
//     const value = decodeURIComponent(params.Roompage);
//     setRoomId(value);

//     if (value) {
//       const myMeeting = async (element: HTMLElement | null) => {
//         if (!element) return;

//         const appID = 727154536;
//         const serverSecret = "f5e1ff7733db9e70ab961f59c658d932";
//         const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
//           appID,
//           serverSecret,
//           value,
//           Date.now().toString(),
//           user.fullname
//         );
//         const zp = ZegoUIKitPrebuilt.create(kitToken);
//         zp.joinRoom({
//           container: element,
//           scenario: {
//             mode: ZegoUIKitPrebuilt.VideoConference,
//           },
//         });
//       };

//       const container = document.querySelector("#meeting-container");
//       if (container) myMeeting(container as HTMLElement);
//     }
//   }, [params]);

//   const handleCancle = async () => {
//     const data = {
//       groupCode: null,
//       communityId: communityId,
//     };
//     console.log(data);

//     try {
//       if (user.role == "profesional") {
//         const proUserData = await axiosInstance.post(
//           "/api/pro/groupCode",
//           data
//         );
//       }
//       router.back();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="bg-[#0d0d0d] h-screen w-screen relative">
//       <div
//         id="meeting-container"
//         className="h-full w-full flex justify-center"
//       />
//       <button
//         type="submit"
//         onClick={handleCancle}
//         className="absolute top-4 right-9 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-700"
//       >
//         <ImCross />
//       </button>
//     </div>
//   );
// };

// export default Room;


"use client";
import React, { useEffect, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { ImCross } from "react-icons/im";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    Roompage: string;
  };
};

const Room = ({ params }: Props) => {
  const [roomId, setRoomId] = useState<string | null>(null);
  const storedUserDetail = localStorage.getItem("userDetail");
  const initialUserState = storedUserDetail
    ? JSON.parse(storedUserDetail)
    : null;
  const [user, setUser] = useState(initialUserState);
  const router = useRouter();

  useEffect(() => {
    if (params && params.Roompage) {
      const val = decodeURIComponent(params.Roompage);
      setRoomId(val);
    }
  }, [params]);

  useEffect(() => {
    if (roomId) {
      const myMeeting = async (element: HTMLElement | null) => {
        if (!element) return;

        const appID = 1848568205;
        const serverSecret = "1c278a906e7d92ea17baa911801330c4";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomId,
          Date.now().toString(),
          user.fullname
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
        });
      };

      const container = document.querySelector("#meeting-container");
      if (container) myMeeting(container as HTMLElement);
    }
  }, [roomId]);

  return (
    <div className="bg-[#0d0d0d] h-screen w-screen relative">
      <div
        id="meeting-container"
        className="h-full w-full flex justify-center"
      />
      <button
        type="submit"
        onClick={() => router.back()}
        className="absolute top-4 right-9 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-700"
      >
        <ImCross />
      </button>
    </div>
  );
};

export default Room;

