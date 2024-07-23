import React, { useRef } from "react";
import classes from "./Controller.module.scss";
import Input from "../UI/Input";
import Button from "../UI/Button";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { hintActions } from "../../store/hint-slice";

const VocAmountController = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const vocAmount = useSelector((state) => state.voc.voc.vocAmount);
  const isChangeable = useSelector((state) => state.voc.isChangeable);
  const isClickable = useSelector((state) => state.hint.isClickable);

  function vocAmountHandler(e) {
    e.preventDefault();

    if (isClickable | isChangeable) {
      return;
    } else if (inputRef.current.value > 20 || inputRef.current.value < 1) {
      dispatch(hintActions.amountError());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
      }, 1500);
    } else if (inputRef.current.value === vocAmount) {
      dispatch(vocActions.changeNewVoc());
    } else {
      dispatch(vocActions.changeAmount(inputRef.current.value));
    }
  }

  return (
    <div className={classes["input-field"]}>
      <Input ref={inputRef} labelName="單字數量" type="number" max={20} min={1}>
        <Button btnName="送出" change onClick={vocAmountHandler} />
      </Input>
    </div>
  );
};

export default VocAmountController;
