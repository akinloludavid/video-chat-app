import React, { useState } from "react";
import { useSocketContext } from "../../context/AppContext";
import { IChildren, IContext } from "../../types";

const Options = ({ children }: IChildren) => {
  const { name, setName, callUser, leaveCall, callAccepted, myId, callEnded } =
    useSocketContext() as IContext;
  const [idToCall, setIdToCall] = useState("");
  const copyToClipboard = (str: string | undefined) => {
    if (str) {
      navigator.clipboard
        .writeText(str)
        .then((val) => {})
        .catch((err) => console.log(err));
    }
  };
  const handleCallUser = (str: string) => {
    callUser(str);
  };
  return (
    <div>
      <div>
        <form>
          <div>
            <label>Account Info</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button type="button" onClick={() => copyToClipboard(myId)}>
              Copy your id
            </button>
          </div>
          <div>
            <label>Make A Call</label>
            <input
              type="text"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            {callAccepted && !callEnded ? (
              <button type="button" onClick={leaveCall}>
                Hang up
              </button>
            ) : (
              <button type="button" onClick={() => handleCallUser(idToCall)}>
                Make a call
              </button>
            )}
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
