import React, { useEffect, useRef, useState } from "react";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const VocabulartItem = ({ eng, chi, store }) => {
  const [isClickable, setIsClickable] = useState(true);
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const wordnik_definition_URL = `https://api.wordnik.com/v4/word.json/${eng}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;
  const wordnik_example_URL = `https://api.wordnik.com/v4/word.json/${eng}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;

  const vocDefinition = useSelector((state) => state.voc.vocDetail.definition);
  const vocSentence = useSelector((state) => state.voc.vocDetail.sentence);
  const vocStorage = useSelector((state) => state.voc.vocStorage);

  useEffect(() => {
    fetch(
      "https://vocabulary-project-422108-default-rtdb.asia-southeast1.firebasedatabase.app/voc.json",
      { method: "PUT", body: JSON.stringify(vocStorage) }
    );
  }, [vocStorage]);

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

  function storeVoc() {
    dispatch(vocActions.store(eng));
  }

  return (
    <>
      <li onClick={clickHandler} className="voc-item">
        <FontAwesomeIcon icon={faBookOpen} />
        <h2>{eng}</h2>
        <div className="action">
          <Button btnName="Got it" bgGreen onClick={rememberClickHandler} />
          {store && <Button btnName="Store" bgRed onClick={storeVoc} />}
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
