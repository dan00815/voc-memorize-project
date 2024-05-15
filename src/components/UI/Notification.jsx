import React from "react";

const Notification = (props) => {
  return (
    <>
      {props.status && (
        <div className="notification">
          <p>{props.title}</p>
        </div>
      )}
    </>
  );
};

export default Notification;
