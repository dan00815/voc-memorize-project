import React from "react";
import Button from "../UI/Button";
import { useDispatch } from "react-redux";
import { vocActions } from "../../store/voc-slice";

const ChangeVocBtn = () => {
  const dispatch = useDispatch();

  function updatedNewVoc() {
    dispatch(vocActions.changeNewVoc());
  }

  return (
    <div className="btn-field">
      <Button btnName="換一批" change onClick={updatedNewVoc} />
    </div>
  );
};

export default ChangeVocBtn;
