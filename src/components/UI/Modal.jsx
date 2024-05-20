import React, { forwardRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import Audio from "../Audio";

const Modal = forwardRef(({ vocData, definition, sentence }, ref) => {
  function closeModalHandler() {
    ref.current.close();
  }

  return createPortal(
    <dialog ref={ref} className="dialog">
      <div className="header">
        <h1>
          {vocData.eng} {vocData.chi}
        </h1>
        <Audio word={vocData.eng} />
      </div>

      <p>定義 : {definition}</p>
      <p>例句: {sentence}</p>
      <div className="actions">
        <Button btnName="Store" />
        <Button onClick={closeModalHandler} bgRed btnName="Close" />
      </div>
    </dialog>,
    document.querySelector("#modal")
  );
});

export default Modal;
