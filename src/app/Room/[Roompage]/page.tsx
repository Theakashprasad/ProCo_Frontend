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
  const storedUserDetail = typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
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

        const appID = 2108290587;
        const serverSecret = "8149853381865d13f7b17b7eba0cc367";
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
  }, [roomId, user]);

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

