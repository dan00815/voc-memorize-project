import React from "react";
import classes from "./Hint.module.scss";
import ProgressBar from "./UI/ProgressBar";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Hint = () => {
  const hintState = useSelector((state) => state.hint.hintState);
  let msg = "";
  let icon = faCircleCheck;

  // delete Error暫時未處理
  if (hintState.vocRemove === true) {
    msg = "Good ! Keep Going";
  } else if (hintState.vocStore === true) {
    msg = "Put Into Box !";
  } else if (hintState.amountError === true) {
    icon = faCircleInfo;
    msg = "Only Accept 1 ~ 20";
  } else if (hintState.registerSuccess === true) {
    msg = "註冊成功！！";
  }

  return (
    <div className={classes.hint}>
      <FontAwesomeIcon icon={icon} />
      <p>{msg}</p>
      <ProgressBar time="1500" />
    </div>
  );
};

export default Hint;
