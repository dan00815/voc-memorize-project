import React from "react";
import classes from "./Controller.module.scss";
import Button from "../UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";

const ChangeVocBtn = () => {
  const dispatch = useDispatch();
  const isChangeable = useSelector((state) => state.voc.UIstate.isChangeable);
  

  function updatedNewVoc() {
    if (isChangeable) {
      return;
    } else {
      dispatch(vocActions.changeNewVoc());
    }
  }

  return (
    <div className={classes["btn-field"]}>
      <Button btnName="換一批" change onClick={updatedNewVoc} />
    </div>
  );
};

export default ChangeVocBtn;
