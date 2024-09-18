import React, { useState, forwardRef } from "react";
import classes from "./Modal.module.scss";
import { createPortal } from "react-dom";
import Button from "./UI/Button";
import Audio from "./UI/Audio";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { vocActions, fetchVocData } from "../store/voc-slice";
import { vocUrl } from "../asset/url";
import axios from "axios";
import { uiActions } from "../store/ui-slice";

const Modal = forwardRef(({ vocData, storeFn, id, index }, ref) => {
  const dispatch = useDispatch();
  const [tagOpen, setTagOpen] = useState(false);
  const token = useSelector((state) => state.login.info.token);
  const onHomePage = useSelector((state) => state.hint.onHomePage);
  const tagsInput = useSelector((state) => state.voc.tagsInput);
  const selectedTagsArray = useSelector((state) => state.voc.editWord.tags);
  const selectedObj = selectedTagsArray.find(
    (data) => data.eng === vocData.english
  );
  const tagsError = useSelector((state) => state.ui.error.tagsError);
  const selectedVoc = useSelector((state) => state.homeVoc.vocData[index]);

  function closeModalHandler() {
    ref.current.close();
    setTagOpen(false);
  }

  function toggleTagHandler() {
    setTagOpen(!tagOpen);

    if (tagOpen === false) {
      dispatch(vocActions.updateTagsInput(""));
    }
  }

  function tagInputHandler(e) {
    dispatch(vocActions.updateTagsInput(e.target.value));
  }

  async function addTag() {
    if (selectedObj.tags.includes(tagsInput)) {
      dispatch(uiActions.showTagsError());
      setTimeout(() => {
        dispatch(uiActions.clearTagsError());
      }, 1000);
    } else {
      dispatch(vocActions.updateTagsInput(""));
      dispatch(vocActions.addTags({ eng: vocData.english, tagsInput }));

      if (selectedObj.tags[0] === "__NoTag") {
        setTimeout(() => {
          closeModalHandler();
          dispatch(vocActions.removeFromBox(id));
        }, 1000);

        try {
          await axios.patch(
            vocUrl + id,
            { tags: [tagsInput] },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          dispatch(fetchVocData());
        } catch (error) {
          console.log(error.message);
        }
      } else {
        try {
          await axios.patch(
            vocUrl + id,
            { tags: [...selectedObj.tags, tagsInput] },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          dispatch(fetchVocData());
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  }

  return createPortal(
    <dialog ref={ref} className={classes.dialog} onClose={closeModalHandler}>
      <div className={classes.header}>
        <h1>
          {vocData.english} {vocData.chinese}
        </h1>
        <Audio word={vocData.english} />

        {!onHomePage && (
          <Link to={`edit/${id}`}>
            <FontAwesomeIcon icon={faPen} className={classes.pen} />
          </Link>
        )}
      </div>

      <>
        <p>定義 : {vocData.definition}</p>
        <p>例句: {vocData.example}</p>
      </>

      <div className={classes.actions}>
        <Button onClick={closeModalHandler} bgClose btnName="Close" />

        {onHomePage && (
          <Button
            btnName="Store"
            bgStore
            onClick={() => {
              storeFn();
              closeModalHandler();
            }}
            disabled={selectedVoc.store}
          />
        )}

        {!onHomePage && (
          <>
            <Button
              bgStore
              btnName="Add Tag"
              onClick={toggleTagHandler}
              style={{ display: !tagOpen ? "block" : "none" }}
            />

            <div
              className={classes.tagInput}
              style={{ display: tagOpen ? "block" : "none" }}
            >
              <span
                onClick={() => {
                  addTag();
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </span>
              <input
                type="text"
                placeholder="Add custom tags"
                onChange={tagInputHandler}
                value={tagsInput}
              />
              <span onClick={toggleTagHandler}>
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </div>
          </>
        )}
      </div>

      {tagsError && <p className={classes.tagsError}>請勿輸入空白或重複標籤</p>}

      {!onHomePage && (
        <div className={classes.tags}>
          {selectedObj &&
            selectedObj.tags[0] !== "__NoTag" &&
            selectedObj.tags.map((tagName, index) => (
              <span key={index}>{tagName}</span>
            ))}
        </div>
      )}
    </dialog>,
    document.querySelector("#modal")
  );
});

export default Modal;
