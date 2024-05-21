import React from "react";
import Dictionary from "./Dictionary";
import VocabulartItem from "./Vocabulart-item";
import { useSelector } from "react-redux";

const Box = () => {
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);

  return (
    <>
      <div className="box">
        <ul className="voc-item-container">
          {vocFromFirebase.map((voc, index) => {
            return <VocabulartItem key={index} eng={voc} />;
          })}
        </ul>
      </div>
      <Dictionary />
    </>
  );
};

export default Box;
