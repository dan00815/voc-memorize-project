import React, { useEffect, useRef } from "react";
import classes from "./Vocabulary-item.module.scss";
import Button from "../UI/Button";
import Modal from "../Modal";
import { definitionUrl, exampleUrl } from "../../asset/url";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const VocabulartItem = ({ eng, chi }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const isClickable = useSelector((state) => state.voc.UIstate.isClickable);
  const onHomePage = useSelector((state) => state.voc.UIstate.onHomePage);
  const vocLength = useSelector((state) => state.voc.voc.eng.length);

  useEffect(() => {
    fetch(
      "https://vocabulary-project-422108-default-rtdb.asia-southeast1.firebasedatabase.app/voc.json",
      { method: "PUT", body: JSON.stringify(vocStorage) }
    );
  }, [vocStorage]);

  function updateVocCheck() {
    if (vocLength === 1) {
      dispatch(vocActions.changeNewVoc());
    }
  }

  function rememberClickHandler() {
    if (isClickable) return;
    else {
      dispatch(vocActions.removeVocFromList({ eng, chi }));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);
    }

    //如果點完最後一個就更新單字庫
    updateVocCheck();
  }

  function storeVoc() {
    if (isClickable) return;
    else {
      dispatch(vocActions.store({ eng, chi }));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);
    }

    //如果點完最後一個就更新單字庫
    updateVocCheck();
  }

  async function openDetail(e) {
    if (e.target.tagName === "svg" || e.target.tagName === "path") {
      try {
        const defiUrl = definitionUrl(eng);
        const definition = await axios.get(defiUrl);
        const definitionResult = definition.data[0].text;

        const exUrl = exampleUrl(eng);
        const exampleSentence = await axios.get(exUrl);
        const exampleSentenceResult = exampleSentence.data.text;

        dispatch(
          vocActions.updateDetail({
            definition: definitionResult,
            sentence: exampleSentenceResult,
          })
        );

        dialogRef.current.showModal();
      } catch (error) {
        console.log(error.message);
      }
    } else return;
  }

  return (
    <>
      <li
        onClick={openDetail}
        className={onHomePage ? classes.vocItem : classes["box-vocItem"]}
      >
        <FontAwesomeIcon icon={faBookOpen} />
        <h2>{eng}</h2>
        <div className={classes.action}>
          <Button btnName="Got it" bgRemember onClick={rememberClickHandler} />
          {onHomePage && <Button btnName="Store" bgStore onClick={storeVoc} />}
        </div>
      </li>

      <Modal ref={dialogRef} vocData={{ eng, chi }} storeFn={storeVoc} />
    </>
  );
};

export default VocabulartItem;
