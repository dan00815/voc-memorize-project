import React from "react";

const Button = ({ btnName, bgRemember, bgStore, bgClose, change, ...props }) => {
  let cssClass = "btn";
  switch (true) {
    case bgRemember:
      cssClass += " bg-remember";
      break;
    case bgStore:
      cssClass += " bg-stroe";
      break;
    case bgClose:
      cssClass += " bg-close";
      break;
    case change:
      cssClass += " changeVoc";
      break;
    default:
      break;
  }

  return (
    <button className={cssClass} {...props}>
      {btnName}
    </button>
  );
};

export default Button;
