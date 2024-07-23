import React from "react";
import { useSelector } from "react-redux";

const ErrorBar = () => {
  const hintState = useSelector((state) => state.hint.hintState);
  let msg = "";

  if (hintState.storeError) {
    msg = hintState.storeError;
  } else if (hintState.removeError) {
    msg = hintState.removeError;
  }

  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "1.25rem",
        padding: "5px 0",
        backgroundColor: "lightsalmon",
      }}
    >
      {msg}
    </div>
  );
};

export default ErrorBar;
