import React from "react";
import Hint from "../Hint";
import VocAmountController from "./VocAmountController";
import ChangeVocBtn from "./ChangeVocBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

import { useSelector } from "react-redux";

const Controller = () => {
  const amountError = useSelector((state) => state.ui.error.amountError);

  return (
    <div className="controller">
      {amountError && (
        <Hint
          message={amountError}
          icon={<FontAwesomeIcon icon={faCircleInfo} />}
        />
      )}

      <VocAmountController />
      <h2 style={{ textAlign: "center" }}>VOC</h2>
      <ChangeVocBtn />
    </div>
  );
};

export default Controller;
