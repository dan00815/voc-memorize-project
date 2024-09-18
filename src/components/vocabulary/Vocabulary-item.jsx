import React, { useRef } from "react";
import classes from "./Vocabulary-item.module.scss";
import Button from "../UI/Button";
import Modal from "../Modal";
import { vocUrl } from "../../asset/url";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faBookmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { hintActions } from "../../store/hint-slice";
import { homeVocActions } from "../../store/homePageVoc.slice";
import { fetchVocData } from "../../store/voc-slice";

const VocabulartItem = ({
  english,
  chinese,
  definition,
  example,
  index,
  id,
}) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const isClickable = useSelector((state) => state.hint.isClickable);
  const onHomePage = useSelector((state) => state.hint.onHomePage);
  const isLogin = useSelector((state) => state.login.info.isLogin);
  const token = useSelector((state) => state.login.info.token);
  const selectedVoc = useSelector((state) => state.homeVoc.vocData[index]);
  const selectedCardStack = useSelector((state) => state.voc.selectedCardStack);

  let cssName = "";
  if (onHomePage) {
    cssName = classes.vocItem;

    if (selectedVoc.remember) {
      cssName += ` ${classes.remember}`;
    } else if (selectedVoc.store) {
      cssName += ` ${classes.store}`;
    }
  } else {
    cssName = classes.boxVocItem;
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
      dispatch(homeVocActions.remember(english));
      showHint();
    } else {
      // profile內按got it
      dispatch(vocActions.removeFromBox(id));
      showHint();

      try {
        await axios.delete(vocUrl + id, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(fetchVocData());
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
  }

  function cancelStore() {
    dispatch(homeVocActions.removeStoreTag(english));
  }

  async function storeVoc() {
    function showHint() {
      dispatch(hintActions.storeVoc());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
      }, 1500);
    }

    if (!isLogin) {
      alert("請先登入才能儲存單字");
    } else if (isClickable) return;
    else {
      dispatch(homeVocActions.store(english));
      dispatch(homeVocActions.updateStoreIndex(english));
      showHint();

      try {
        await axios.post(
          vocUrl,
          { english, chinese, definition, example },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // 連結database更新畫面
        dispatch(fetchVocData());
      } catch (error) {
        console.log(error);
        dispatch(
          homeVocActions.cancelStore({
            data: { english, chinese, definition, example },
          })
        );

        dispatch(hintActions.recoverStore(error.message));
        setTimeout(() => {
          dispatch(hintActions.clearStoreError());
        }, 1000);
      }
    }
  }

  async function openDetail() {
    if (onHomePage) {
      dispatch(
        vocActions.updateDetail({
          definition,
          example,
          english,
          chinese,
        })
      );
    } else {
      // profile頁面的openDetail做特殊處理
      const selectedVoc = selectedCardStack.vocabularies.find(
        (word) => word.vocId === id
      );

      dispatch(vocActions.updateEditWord(selectedVoc));
      dispatch(vocActions.updateTags(selectedVoc.english));
    }

    dialogRef.current.showModal();
  }

  return (
    <>
      <li className={cssName}>
        {onHomePage && selectedVoc.store && (
          <FontAwesomeIcon
            icon={faBookmark}
            className={classes.storeBookmarkIcon}
            onClick={cancelStore}
          />
        )}

        <FontAwesomeIcon
          icon={faBookOpen}
          onClick={openDetail}
          className={classes.openBook}
        />
        <h2>{english}</h2>
        <div className={classes.action}>
          <Button
            btnName="Got it"
            bgRemember
            onClick={rememberClickHandler}
            disabled={onHomePage && selectedVoc.store}
          />
          {onHomePage && (
            <Button
              btnName="Store"
              bgStore
              onClick={storeVoc}
              disabled={selectedVoc.store}
            />
          )}
        </div>
      </li>

      <Modal
        ref={dialogRef}
        vocData={{ english, chinese, definition, example }}
        storeFn={storeVoc}
        id={id}
        index={index}
      />
    </>
  );
};

export default VocabulartItem;
