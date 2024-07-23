import React, { forwardRef } from "react";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import Button from "./UI/Button";
import Audio from "./UI/Audio";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Modal = forwardRef(({ vocData, storeFn, id }, ref) => {
  const onHomePage = useSelector((state) => state.hint.onHomePage);
  const vocDetail = useSelector((state) => state.voc.vocDetail);
  const editWord = useSelector((state) => state.voc.editWord);

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

        {!onHomePage && (
          <Link to={`/edit/${id}`}>
            <FontAwesomeIcon icon={faPen} className={classes.pen} />
          </Link>
        )}
      </div>

      {onHomePage && (
        <>
          <p>定義 : {vocDetail.definition ?? "not support"}</p>
          <p>例句: {vocDetail.sentence ?? "not support"}</p>
        </>
      )}

      {!onHomePage && (
        <>
          <p>定義 : {editWord.definition}</p>
          <p>例句: {editWord.example}</p>
        </>
      )}

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
