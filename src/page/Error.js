import React from "react";
import errorImg from "../asset/images/error-image.png";

const Error = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", textAlign: "center", marginBottom: "0" }}>
        Something Gone Wrong
      </h1>
      <img src={errorImg} alt="error-img" />
    </div>
  );
};

export default Error;
