import React from "react";

const Button = ({ btnName, remember, notRemember, change, ...props }) => {
  let cssClass = "btn";
  if (remember) {
    cssClass += " remember";
  } else if (notRemember) {
    cssClass += " notRemember";
  } else {
    cssClass += " changeVoc";
  }

  return (
    <button className={cssClass} {...props}>
      {btnName}
    </button>
  );
};

export default Button;
