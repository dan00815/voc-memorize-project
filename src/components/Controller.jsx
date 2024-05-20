import React, { useRef } from "react";
import Input from "./UI/Input";
import Button from "./UI/Button";
import Hint from "./Hint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { uiActions } from "../store/ui-slice";

const Controller = () => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  const amountError = useSelector((state) => state.ui.error.amountError);
  const vocAmount = useSelector((state) => state.voc.vocAmount);

  function updatedNewVoc() {
    dispatch(vocActions.changeNewVoc());
  }

  function vocAmountHandler(e) {
    e.preventDefault();

    if (inputRef.current.value > 20 || inputRef.current.value < 1) {
      dispatch(uiActions.showAmountError("Only Accept 1 ~ 20"));
      //error訊息1.5秒後消失，非同步函式不能直接寫在redux裡
      setTimeout(() => {
        dispatch(uiActions.clearAmountError());
      }, 1500);
    } else if (inputRef.current.value === vocAmount) {
      dispatch(vocActions.changeNewVoc());
    } else {
      dispatch(vocActions.changeAmount(inputRef.current.value));
    }
  }

  return (
    <div className="controller">
      {amountError && (
        <Hint
          message={amountError}
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
        />
      )}

      <div className="input-field">
        <Input
          ref={inputRef}
          labelName="單字數量"
          type="number"
          max={20}
          min={1}
        >
          <button onClick={vocAmountHandler}>送出</button>
        </Input>
      </div>

      <h2 style={{ textAlign: "center" }}>VOC</h2>
      <div className="btn-field">
        <Button btnName="換一批" change onClick={updatedNewVoc} />
      </div>
    </div>
  );
};

export default Controller;
