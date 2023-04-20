import { useSocketContext } from "../../context/AppContext";
import { IContext } from "../../types";

const Notifications = () => {
  const { call, callAccepted, answerCall } = useSocketContext() as IContext;

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div>
          <h2>{call.name} is calling</h2>
          <button onClick={answerCall}>Answer call</button>
        </div>
      )}
      <div></div>
    </>
  );
};

export default Notifications;
