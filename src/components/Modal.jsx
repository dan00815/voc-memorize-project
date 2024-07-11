import React, { forwardRef } from "react";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import Button from "./UI/Button";
import Audio from "./UI/Audio";
import { useSelector } from "react-redux";

const Modal = forwardRef(({ vocData, storeFn }, ref) => {
  const onHomePage = useSelector((state) => state.voc.UIstate.onHomePage);
  const vocDetail = useSelector((state) => state.voc.vocDetail);

  function closeModalHandler() {
    ref.current.close();
  }

  return createPortal(
    <dialog ref={ref} className={classes.dialog}>
      <div className={classes.header}>
        <h1>
          {vocData.english} {vocData.chinese}
        </h1>
        <Audio word={vocData.english} />
      </div>

      <p>定義 : {vocDetail.definition ?? "not support"}</p>
      <p>例句: {vocDetail.sentence ?? "not support"}</p>

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
