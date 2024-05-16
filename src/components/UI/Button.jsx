import React from "react";

const Button = ({ btnName, bgGreen, bgRed, change, ...props }) => {
  let cssClass = "btn";
  if (bgGreen) {
    cssClass += " bg-green";
  } else if (bgRed) {
    cssClass += " bg-red";
  } else if (change) {
    cssClass += " changeVoc";
  }

  return (
    <button className={cssClass} {...props}>
      {btnName}
    </button>
  );
};

export default Button;
