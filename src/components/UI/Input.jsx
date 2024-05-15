import React from "react";
import { forwardRef } from "react";

const Input = forwardRef(({ labelName, children, ...props }, ref) => {
  return (
    <>
      <label>{labelName}</label>
      <input ref={ref} {...props} />
      {children}
    </>
  );
});

export default Input;
