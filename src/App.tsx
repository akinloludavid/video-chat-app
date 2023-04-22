import { useEffect, useRef, useState } from "react";
import Peer, { MediaConnection } from "peerjs";
import { IMessage } from "./types";
function App() {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstance = useRef<any>(null);
  const [callObj, setCallObj] = useState<any>(null);
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peerId, setPeerId] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [currentMediaStream, setMediaStream] = useState<MediaStream>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const peer = new Peer();
    peer.on("connection", (conn) => {
      console.log("object");
      conn.on("data", (data: any) => {
        setMessages((prev) => [...prev, data]);
      });
    });
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      setCallObj(call);
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setMediaStream(mediaStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = mediaStream;
          }
        });
    });
    peerInstance.current = peer;
  }, []);

  const makeCall = (id: string) => {
    setIsCalling(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // setStream(stream);
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;
        const call = peerInstance.current.call(id, stream);
        call.on("stream", (remoteStream: MediaStream) => {
          if (remoteVideoRef.current)
            remoteVideoRef.current.srcObject = remoteStream;
        });
      });
  };
  const answerCall = (call: MediaConnection, mediaStream: MediaStream) => {
    call.answer(mediaStream);
    call.on("stream", (remoteStream: MediaStream) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = remoteStream;
    });
  };
  const copyToClipBoard = (str: string) => {
    navigator.clipboard.writeText(str).then(() => {
      "copied";
    });
  };
  const handleHangUp = () => {
    peerInstance.current.destroy();
    window.location.reload();
  };
  const sendMessage = () => {
    const conn = peerInstance.current.connect(remotePeerId);
    conn.on("open", () => {
      const msgObj = {
        sender: peerId,
        message,
      };
      conn.send(msgObj);
      setMessages((prev) => [...prev, msgObj]);
      setMessage("");
    });
  };
  return (
    <>
      <div>
        {messages.map((el, idx) => (
          <div key={idx}>
            <h5>{el.sender}</h5>
            <p>{el.message}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={remotePeerId}
        onChange={(e) => setRemotePeerId(e.target.value)}
      />
      <div>
        <button onClick={() => copyToClipBoard(peerId)}>Copy id</button>
        <button onClick={() => makeCall(remotePeerId)}>Call</button>

        <button
          onClick={() => answerCall(callObj, currentMediaStream as MediaStream)}
        >
          Answer call
        </button>
        {isCalling && <button onClick={handleHangUp}>Hang up</button>}
      </div>
      <div>
        {isCalling && <p>Calling {remotePeerId}</p>}
        <video ref={myVideoRef} autoPlay />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay />
      </div>

      <textarea
        name="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        id="message"
      ></textarea>
      <button onClick={sendMessage}>Send message</button>
    </>
  );
}

export default App;
