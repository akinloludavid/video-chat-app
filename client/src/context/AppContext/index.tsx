import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
// import Peer, { SignalData } from "simple-peer";
import Peer from "peerjs";
import { IChildren, IContext } from "../../types";

const initialValues = {
  call: {},
  leaveCall: () => {},
  answerCall: () => {},
  callUser: (id: string) => {},
  callAccepted: false,
  callEnded: false,
  setName: (e: string) => {},
  name: "",
  myVideo: undefined,
  userVideo: undefined,
  myId: "",
  stream: undefined,
  connectionRef: undefined,
  setStream: (e: MediaStream | undefined) => {},
};
export const SocketContext = createContext<IContext | null>(null);

const socket = io("http://localhost:5002");

export const useSocketContext = (): IContext | null =>
  useContext(SocketContext);
export const ContextProvider = ({ children }: IChildren) => {
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [myId, setMyId] = useState("");
  const [call, setCall] = useState<any>({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef<HTMLVideoElement>(null);
  const userVideo = useRef<HTMLVideoElement>(null);
  const connectionRef = useRef<any>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

    socket.on("me", (id) => {
      setMyId(id);
    });
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer();
    // const peer = new Peer({ initiator: false, trickle: false, stream });
    // peer.on("signal", (data: any) => {
    //   socket.emit("answerCall", { signal: data, to: call.from });
    // });
    // peer.on("stream", (currentStream: any) => {
    //   userVideo.current!.srcObject = currentStream;
    // });
    // peer.signal(call.signal);
    // connectionRef.current = peer;
  };

  const callUser = (id: string) => {
    const peer = new Peer();
    const makeCall = peer.call(id, stream as MediaStream);
    makeCall.on("stream", (currentStream: MediaStream) => {
      console.log("calling");
      userVideo.current!.srcObject = currentStream;
    });
    // const peer = new Peer({ initiator: true, trickle: false, stream });
    // peer.on("signal", (data: SignalData) => {
    //   socket.emit("callUser", {
    //     userToCall: id,
    //     signalData: data,
    //     from: myId,
    //     name,
    //   });
    // });

    // peer.on("stream", (currentStream: MediaStream) => {
    //   console.log("there");
    //   userVideo.current!.srcObject = currentStream;
    // });

    // socket.on("callAccepted", (signal) => {
    //   setCallAccepted(true);
    //   peer.signal(signal);
    // });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    window.location.reload();
  };

  const values = {
    call,
    leaveCall,
    answerCall,
    callUser,
    callAccepted,
    callEnded,
    setName,
    name,
    myVideo,
    userVideo,
    myId,
    stream,
    setStream,
  };
  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};
