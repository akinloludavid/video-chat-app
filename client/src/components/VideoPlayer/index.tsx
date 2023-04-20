import { useSocketContext } from "../../context/AppContext";
import { IContext } from "../../types";

const VideoPlayer = () => {
  const { name, callAccepted, stream, myVideo, userVideo, call, callEnded } =
    useSocketContext() as IContext;
  return (
    <div>
      {stream && (
        <div>
          <h5>{name || "Name"}</h5>
          <video playsInline muted ref={myVideo} autoPlay />
        </div>
      )}

      {callAccepted && !callEnded && (
        <div>
          <h5>{call?.name || "Name"}</h5>
          <video playsInline ref={userVideo} autoPlay />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
