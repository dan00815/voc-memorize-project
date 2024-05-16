import React, { useRef, useState } from "react";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const VocabulartItem = ({ eng, chi, index }) => {
  const [isClickable, setIsClickable] = useState(true);
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const wordnik_definition_URL = `https://api.wordnik.com/v4/word.json/${eng}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;
  const wordnik_example_URL = `https://api.wordnik.com/v4/word.json/${eng}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;

  const vocDefinition = useSelector((state) => state.voc.vocDetail.definition);
  const vocSentence = useSelector((state) => state.voc.vocDetail.sentence);

  function rememberClickHandler() {
    if (!isClickable) return;

    dispatch(vocActions.removeVocFromList({ eng, chi }));

    setIsClickable(false);

    if (isClickable) {
      setTimeout(() => {
        dispatch(vocActions.vocRemoveRecover());
        setIsClickable(true);
      }, 1500);
    }
  }

  async function clickHandler(e) {
    if (e.target.tagName === "svg" || e.target.tagName === "path") {
      try {
        const definition = await axios.get(wordnik_definition_URL);
        const definitionResult =
          definition.data[0].text ||
          definition.data[1].text ||
          definition.data[2].text;

        const exampleSentence = await axios.get(wordnik_example_URL);
        const exampleSentenceResult = await exampleSentence.data.text;

        dispatch(
          vocActions.updateDetail({
            definition: definitionResult,
            sentence: exampleSentenceResult,
          })
        );
      } catch (error) {
        console.log(error);
      }

      dialogRef.current.showModal();
    }
  }

  return (
    <>
      <li onClick={clickHandler}>
        <FontAwesomeIcon icon={faBookOpen} />
        <h2>{eng}</h2>
        <h3>{chi}</h3>
        <div className="action">
          <Button btnName="Got it" bgGreen onClick={rememberClickHandler} />
          <Button btnName="Store" bgRed />
        </div>
      </li>

      <Modal
        ref={dialogRef}
        vocData={{ eng, chi }}
        definition={vocDefinition ? vocDefinition : "not support"}
        sentence={vocSentence ? vocSentence : "not support"}
      />
    </>
  );
};

export default VocabulartItem;
