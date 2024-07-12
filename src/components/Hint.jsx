import React from "react";
import classes from "./Hint.module.scss";
import ProgressBar from "./UI/ProgressBar";
import { useSelector } from "react-redux";

const Hint = ({ message, icon }) => {
  const hintState = useSelector((state) => state.voc.UIstate.hintState);
  let msg = "";

  if (hintState.vocRemove === true) {
    msg = "Good ! Keep Going";
  } else if (hintState.removeError === true) {
    msg = "Delete Error";
  } else if (hintState.vocStore === true) {
    msg = "Put Into Box !";
  } else if (hintState.storeError === true) {
    msg = "Store Error";
  }

  return (
    <div className={classes.hint}>
      {icon}
      {/* <p>{message}</p> */}
      <p>{msg}</p>
      <ProgressBar time="1500" />
    </div>
  );
};

export default Hint;
