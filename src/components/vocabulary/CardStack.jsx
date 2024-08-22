import React from "react";
import classes from "./CardStack.module.scss";
import boxOpen from "../../asset/images/boxopen.gif";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { vocActions } from "../../store/voc-slice";
import { dictiActions } from "../../store/dictionary-slice";

const CardStack = ({ tags }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vocData = useSelector((state) => state.voc.vocData);
  let tagsName = "";

  if (tags === "__NoTag") {
    tagsName = "無標籤";
  } else tagsName = tags;

  async function showDetailVoc() {
    const selectedCardStack = vocData.find((stack) => stack.name === tags);
    dispatch(vocActions.updateSelectedStack(selectedCardStack));

    if (tags === "__NoTag") {
      navigate(`/profile/無標籤`);
    } else navigate(`/profile/${tags}`);

    dispatch(dictiActions.resetDictionary());
  }

  return (
    <div className={classes.cardStack}>
      <p>{tagsName}</p>
      <div className={classes.imgContainer} onClick={showDetailVoc}>
        <img src={boxOpen} alt="boxOpen" />
      </div>
    </div>
  );
};

export default CardStack;
