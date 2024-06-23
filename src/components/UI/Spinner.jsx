import React from "react";
import classes from "./Spinner.module.scss";
import { Spinner } from "react-bootstrap";

const SpinnerElm = () => {
  return (
    <div className={classes.filter}>
      <div className={classes.spinnerText}>Wait a moment</div>
      <Spinner animation="border" role="status" aria-hidden="true">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default SpinnerElm;
