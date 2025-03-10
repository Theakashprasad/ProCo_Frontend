"use client";

import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { OngoingCall, Participants, PeerData, User } from "@/Types/chat";
import Peer, { SignalData } from "simple-peer";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface iSocketState {
  socket: Socket | null;
  isSocketConnected: boolean;
  initializeSocket: () => void;
  disconnectSocket: () => void;
  ongoingCall: OngoingCall | null;
  localStream: MediaStream | null;
  peer: PeerData | null;
  currentUser: User | null;
  emitJoinChat: (chatId: string) => void;

  emitChatMessage: (messageData: {
    chatId: string;
    senderId: string;
    receiverId: string;
    messageText: string;
    createdAt: number;
  }) => void;

  handleCall: (receiverUser: User) => void;

  handleIncomingCall: (participants: Participants) => void;

  handleJoinCall: (ongoingCall: OngoingCall) => void;

  getMediaStream: (faceMode?: string) => Promise<MediaStream | null>;

  createPeer: (stream: MediaStream, initiator: boolean) => Peer.Instance;
  handleHangupDuringInitiation: () => void;
  handleCallCancelled: (message: string) => void;
  cleanupMediaStream: () => void;

  handleHangup: () => void;

  completePeerConnection: (data: {
    sdp: SignalData;
    ongoingCall: OngoingCall;
    isCaller: boolean;
  }) => void;
}

export const useSocketStore = create<iSocketState>((set, get) => ({
  socket: null,
  isSocketConnected: false,
  ongoingCall: null,
  localStream: null,
  peer: null,
  currentUser: null,

  getMediaStream: async (faceMode) => {
    const localStream = get().localStream;
    if (localStream) {
      return localStream;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 360, ideal: 720, max: 1080 },
          frameRate: { min: 16, ideal: 30, max: 30 },
          facingMode: videoDevices.length > 0 ? faceMode : undefined,
        },
      });
      set({
        localStream: stream,
      });
      return stream;
    } catch (error) {
      console.log("Failed to get the stream", error);
      set({ localStream: null });
      return null;
    }
  },

  handleCall: async (receiverUser) => {
    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    const initialUserState = storedUserDetail
      ? JSON.parse(storedUserDetail)
      : null;
    set({
      currentUser: initialUserState,
    });
    console.log("initialing call");
    const data = {
      proId: initialUserState._id,
      name: initialUserState.fullname,
      userId: receiverUser._id,
    };
    const responses = await axiosInstance.post("/api/pro/proPayment", data);

    const callerUser = get().currentUser;
    const socket = get().socket;
    if (!callerUser || !socket) return;

    const stream = await get().getMediaStream();

    if (!stream) {
      console.log("No stream in handle call");
      return;
    }

    const participants = { caller: callerUser, receiver: receiverUser };
    set({
      ongoingCall: {
        participants,
        isRinging: false,
      },
    });
    console.log(participants, "emit call");
    socket.emit("call", participants);
  },

  handleIncomingCall: (participants) => {
    console.log("handle incoming call");
    set({
      ongoingCall: {
        participants,
        isRinging: true,
      },
    });
  },

  cleanupMediaStream: () => {
    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    set({ localStream: null });
  },

  handleHangupDuringInitiation: () => {
    const { socket, ongoingCall } = get();
    if (socket && ongoingCall) {
      socket.emit("hangupDuringInitiation", ongoingCall);
    }
    get().cleanupMediaStream();
    set({ ongoingCall: null });
  },

  handleCallCancelled: (message: string) => {
    console.log("Call cancelled:", message);
    set({
      ongoingCall: null,
      localStream: undefined,
    });
  },

  handleHangup: () => {
    const { socket, peer, localStream, ongoingCall } = get();
    if (peer && peer.peerConnection) {
      peer.peerConnection.destroy();
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (socket && ongoingCall) {
      socket.emit("hangup", ongoingCall);
    }
    set({
      ongoingCall: null,
      localStream: null,
      peer: null,
    });
  },

  createPeer: (stream, initiator) => {
    const iceServers: RTCIceServer[] = [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
        ],
      },
    ];

    const peer = new Peer({
      stream,
      initiator,
      trickle: true,
      config: { iceServers },
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      set((state) => ({
        ...state,
        peer: state.peer
          ? {
              ...state.peer,
              stream: remoteStream,
            }
          : null,
      }));
    });

    peer.on("error", console.error);
    peer.on("close", () => get().handleHangup());

    const rtcPeerConnection: RTCPeerConnection = (peer as any)._pc;
    rtcPeerConnection.oniceconnectionstatechange = async () => {
      if (
        rtcPeerConnection.iceConnectionState === "disconnected" ||
        rtcPeerConnection.iceConnectionState === "failed"
      ) {
        get().handleHangup();
      }
    };

    return peer;
  },

  completePeerConnection: (data) => {
    const localStream = get().localStream;
    if (!localStream) {
      console.log("Missing the localStream");
      return;
    }
    const peer = get().peer;
    if (peer) {
      peer.peerConnection?.signal(data.sdp);
      return;
    }

    const newPeer = get().createPeer(localStream, true);
    set({
      peer: {
        peerConnection: newPeer,
        participantUser: data.ongoingCall.participants.receiver,
        stream: undefined,
      },
    });

    newPeer.on("signal", async (signalData: SignalData) => {
      const { socket } = get();
      if (socket) {
        socket.emit("webrtcSignal", {
          sdp: signalData,
          ongoingCall: data.ongoingCall,
          isCaller: true,
        });
      }
    });
  },

  handleJoinCall: async (ongoingCall) => {
    console.log("joining");
    set((state) => {
      if (state.ongoingCall) {
        return {
          ongoingCall: {
            ...state.ongoingCall,
            ...ongoingCall,
            isRinging: false,
          },
        };
      } else {
        return {
          ongoingCall: {
            ...ongoingCall,
            isRinging: false,
          },
        };
      }
    });

    const stream = await get().getMediaStream();
    if (!stream) {
      console.log("Could not gt stream in handleJoinCall");
      return;
    }

    const newPeer = get().createPeer(stream, true);
    set({
      peer: {
        peerConnection: newPeer,
        participantUser: ongoingCall.participants.caller,
        stream: undefined,
      },
    });

    newPeer.on("signal", async (data: SignalData) => {
      const { socket } = get();
      if (socket) {
        socket.emit("webrtcSignal", {
          sdp: data,
          ongoingCall,
          isCaller: false,
        });
      }
    });
  },

  initializeSocket: () => {
    const storedUserDetail =
      typeof window !== "undefined" ? localStorage.getItem("userDetail") : null;
    const initialUserState = storedUserDetail
      ? JSON.parse(storedUserDetail)
      : null;
    set({
      currentUser: initialUserState,
    });
    console.log("initialing call");
    const user = get().currentUser;
    if (!user || !user._id) {
      console.error("User is not properly authenticated");
      return;
    }

    const newSocket = io(`${BASE_URL}`);
    console.log("connecting");
    set({ socket: newSocket });

    const onConnect = () => {
      set({ isSocketConnected: true });
      console.log("user connected", user._id);
      newSocket.emit("user_connected", user._id);
    };

    const onDisconnect = () => {
      set({ isSocketConnected: false });
    };

    newSocket.on("incomingCall", (callData) => {
      console.log("Incoming call received:", callData);
      get().handleIncomingCall(callData);
    });

    newSocket.on("webrtcSignal", (data) => {
      get().completePeerConnection(data);
    });

    newSocket.on("connect", onConnect);
    newSocket.on("disconnect", onDisconnect);

    return () => {
      newSocket.off("connect", onConnect);
      newSocket.off("disconnect", onDisconnect);
      newSocket.off("inComingCall");
      newSocket.off("webrtcSignal");
      newSocket.disconnect();
    };
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isSocketConnected: false });
    }
  },

  emitJoinChat: (chatId: string) => {
    const { socket } = get();

    socket?.emit("join chat", { chatId });
  },

  //to sent messaeg to backend in realy time
  emitChatMessage(messageData) {
    console.log("emitting");
    const { socket } = get();
    console.log(socket);
    socket?.emit("chat message", messageData);
  },
}));

export const useSocket = () => {
  const socketState = useSocketStore();
  if (!socketState) {
    throw new Error("Socket state is not initialized");
  }
};
