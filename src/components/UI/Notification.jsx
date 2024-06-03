import React from "react";
import classes from "./Notification.module.scss";

const Notification = (props) => {
  return (
    <>
      {props.status && (
        <div className={classes.notification}>
          <p>{props.title}</p>
        </div>
      )}
    </>
  );
};

export default Notification;
