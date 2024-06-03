import React from "react";
import classes from "./Controller.module.scss";
import VocAmountController from "./VocAmountController";
import ChangeVocBtn from "./ChangeVocBtn";

const Controller = () => {
  return (
    <div className={classes.controller}>
      <VocAmountController />
      <h2>Vocabulary</h2>
      <ChangeVocBtn />
    </div>
  );
};

export default Controller;
