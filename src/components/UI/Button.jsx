import React from "react";
import classes from "./Button.module.scss";

const Button = ({
  btnName,
  bgRemember,
  bgStore,
  bgClose,
  change,
  ...props
}) => {
  let cssClass = classes.btn;
  switch (true) {
    case bgRemember:
      cssClass += ` ${classes.bgRemember}`;
      break;
    case bgStore:
      cssClass += ` ${classes.bgStore}`;
      break;
    case bgClose:
      cssClass += ` ${classes.bgClose}`;
      break;
    case change:
      cssClass += ` ${classes.changeVoc}`;
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
