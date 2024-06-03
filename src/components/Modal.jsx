import React, { forwardRef } from "react";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import Button from "./UI/Button";
import Audio from "./UI/Audio";
import { useSelector } from "react-redux";

const Modal = forwardRef(({ vocData, definition, sentence, storeFn }, ref) => {
  const onHomePage = useSelector((state) => state.voc.voc.onHomePage);

  function closeModalHandler() {
    ref.current.close();
  }

  return createPortal(
    <dialog ref={ref} className={classes.dialog}>
      <div className={classes.header}>
        <h1>
          {vocData.eng} {vocData.chi}
        </h1>
        <Audio word={vocData.eng} />
      </div>

      <p>定義 : {definition}</p>
      <p>例句: {sentence}</p>

      <div className={classes.actions}>
        {onHomePage && (
          <Button
            btnName="Store"
            bgStore
            onClick={() => {
              storeFn();
              closeModalHandler();
            }}
          />
        )}
        <Button onClick={closeModalHandler} bgClose btnName="Close" />
      </div>
    </dialog>,
    document.querySelector("#modal")
  );
});

export default Modal;
