import React from "react";
import errorImg from "../asset/images/error-image.png";

const Error = () => {
  return (
    <div className="error">
      <h1>Something Gone Wrong</h1>
      <img src={errorImg} alt="error-img" />
    </div>
  );
};

export default Error;
