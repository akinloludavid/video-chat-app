import React, { MutableRefObject, RefObject } from "react";

export interface IChildren {
  children: React.ReactNode;
}

export interface IContext {
  call: Record<string, any>;
  leaveCall: () => void;
  answerCall: () => void;
  callUser: (id: string) => void;
  callAccepted: boolean;
  callEnded: boolean;
  setName: (e: string) => void;
  name: string;
  myVideo: RefObject<HTMLVideoElement> | undefined;
  userVideo: RefObject<HTMLVideoElement> | undefined;
  connectionRef?: any;
  myId: string;
  stream: MediaStream | undefined;
  setStream: (e: MediaStream | undefined) => void;
}
