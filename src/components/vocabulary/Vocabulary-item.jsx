import React, { useRef } from "react";
import classes from "./Vocabulary-item.module.scss";
import Button from "../UI/Button";
import Modal from "../Modal";
import { definitionUrl, exampleUrl, vocUrl } from "../../asset/url";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { uiActions } from "../../store/ui-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const VocabulartItem = ({ english, chinese, id }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const isClickable = useSelector((state) => state.voc.UIstate.isClickable);
  const onHomePage = useSelector((state) => state.voc.UIstate.onHomePage);
  const vocLength = useSelector((state) => state.voc.voc.english.length);
  const isLogin = useSelector((state) => state.login.info.isLogin);
  const token = useSelector((state) => state.login.info.token);

  function updateVocCheck() {
    if (vocLength === 1) {
      dispatch(vocActions.changeNewVoc());
    }
  }

  async function rememberClickHandler() {
    if (isClickable) return;
    else if (onHomePage) {
      dispatch(vocActions.removeVocFromList({ english, chinese }));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);
    } else {
      dispatch(vocActions.removeVocFromList(english));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);

      try {
        axios.delete(vocUrl + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.log(error);
      }
    }

    //如果點完最後一個就更新單字庫
    updateVocCheck();
  }

  async function storeVoc() {
    if (!isLogin) {
      alert("請先登入才能儲存單字");
    } else if (isClickable) return;
    else {
      // 我先從主頁刪掉單字
      dispatch(vocActions.store({ english, chinese }));
      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);

      try {
        //待處理，儲存單字還要將定義例句放進去
        const res = await axios.post(
          vocUrl,
          { english, chinese },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const vocID = res.data.vocabularyId;
        dispatch(vocActions.storeNewVocData({ english, chinese, id: vocID }));
      } catch (error) {
        dispatch(vocActions.reverseStore({ english, chinese }));
        setTimeout(() => {
          dispatch(vocActions.recoverClickable());
        }, 1500);
      }
    }

    //如果點完最後一個就更新單字庫
    updateVocCheck();
  }

  async function openDetail(e) {
    if (e.target.tagName === "svg" || e.target.tagName === "path") {
      try {
        const defiUrl = definitionUrl(english);
        const definition = await axios.get(defiUrl);
        const definitionResult = definition.data[0].text;

        const exUrl = exampleUrl(english);
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
        <h2>{english}</h2>
        <div className={classes.action}>
          <Button btnName="Got it" bgRemember onClick={rememberClickHandler} />
          {onHomePage && <Button btnName="Store" bgStore onClick={storeVoc} />}
        </div>
      </li>

      <Modal
        ref={dialogRef}
        vocData={{ english, chinese }}
        storeFn={storeVoc}
      />
    </>
  );
};

export default VocabulartItem;
