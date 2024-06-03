import React from "react";
import classes from "./Hint.module.scss";
import ProgressBar from "./UI/ProgressBar";

const Hint = ({ message, icon }) => {
  return (
    <div className={classes.hint}>
      {icon}
      <p>{message}</p>
      <ProgressBar time="1500" />
    </div>
  );
};

export default Hint;
