import React from "react";
import ProgressBar from "./UI/ProgressBar";

const Hint = ({ message, icon }) => {
  return (
    <div className="hint">
      {icon}
      <p>{message}</p>
      <ProgressBar time="1500" />
    </div>
  );
};

export default Hint;
