import React, { useRef } from "react";
import classes from "./Vocabulary-item.module.scss";
import Button from "../UI/Button";
import Modal from "../Modal";
import { definitionUrl, exampleUrl, vocUrl } from "../../asset/url";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { hintActions } from "../../store/hint-slice";

const VocabulartItem = ({ english, chinese, definition, example, id }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const vocLength = useSelector((state) => state.voc.voc.english.length);
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const isClickable = useSelector((state) => state.hint.isClickable);
  const onHomePage = useSelector((state) => state.hint.onHomePage);
  const isLogin = useSelector((state) => state.login.info.isLogin);
  const token = useSelector((state) => state.login.info.token);

  function updateVocCheck() {
    if (vocLength === 1) {
      dispatch(vocActions.changeNewVoc());
    }
  }

  async function rememberClickHandler() {
    function showHint() {
      dispatch(hintActions.removeVoc());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
      }, 1500);
    }

    if (isClickable) return;
    else if (onHomePage) {
      dispatch(vocActions.removeFromHome({ english, chinese }));

      showHint();
    } else {
      // 在BOX
      dispatch(vocActions.removeFromBox(id));

      showHint();

      try {
        await axios.delete(vocUrl + id, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        dispatch(
          vocActions.cancelRemove({ english, chinese, definition, example, id })
        );

        dispatch(hintActions.recoverRemove(error.message));
        setTimeout(() => {
          dispatch(hintActions.clearRemoveError());
        }, 1000);
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
      dispatch(vocActions.updateStoreIndex({ english }));
      dispatch(vocActions.removeFromHome({ english, chinese }));

      dispatch(hintActions.storeVoc());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
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
        dispatch(vocActions.storeVocData({ english, chinese, id: vocID }));
      } catch (error) {
        dispatch(vocActions.cancelStore({ english, chinese }));

        dispatch(hintActions.recoverStore(error.message));
        setTimeout(() => {
          dispatch(hintActions.clearStoreError());
        }, 1000);
      }
    }

    //如果點完最後一個就更新單字庫
    updateVocCheck();
  }

  async function openDetail(e) {
    if (e.target.tagName === "svg" || e.target.tagName === "path") {
      //如果再Home，detail就是發API找然後放進detail更新
      if (onHomePage) {
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
              english,
              chinese,
            })
          );
        } catch (error) {
          console.log(error.message);
        }
      } else {
        // 在BOX中打開，用id找到選取的單字，放進selectedWord
        const selectedVoc = vocStorage.find((word) => word.id === id);
        dispatch(vocActions.updateEditWord(selectedVoc));
      }

      dialogRef.current.showModal();
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
        id={id}
      />
    </>
  );
};

export default VocabulartItem;
