import React, { useEffect } from "react";
import Dictionary from "./Dictionary";
import VocabulartItem from "./Vocabulart-item";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { vocActions } from "../store/voc-slice";

const Box = () => {
  const dispatch = useDispatch();
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);

  useEffect(() => {
    dispatch(vocActions.changeToBox());
  }, []);

  return (
    <>
      <div className="box">
        <ul className="voc-item-container">
          {vocFromFirebase.map((voc, index) => {
            return <VocabulartItem key={index} eng={voc.eng} chi={voc.chi} />;
          })}
        </ul>
        {vocFromFirebase.length === 0 && (
          <h1>There are no vocabulary in the Box !!!</h1>
        )}
      </div>
      <Dictionary />
    </>
  );
};

export default Box;
