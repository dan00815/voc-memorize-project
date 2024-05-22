import React, { useEffect, useRef } from "react";
import Button from "./UI/Button";
import Modal from "./UI/Modal";

import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const VocabulartItem = ({ eng, chi, store }) => {
  const dialogRef = useRef();
  const dispatch = useDispatch();
  const wordnik_definition_URL = `https://api.wordnik.com/v4/word.json/${eng}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;
  const wordnik_example_URL = `https://api.wordnik.com/v4/word.json/${eng}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`;

  const vocDetail = useSelector((state) => state.voc.vocDetail);
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const isClickable = useSelector((state) => state.voc.isClickable);
  const onHomePage = useSelector((state) => state.voc.voc.onHomePage);

  useEffect(() => {
    fetch(
      "https://vocabulary-project-422108-default-rtdb.asia-southeast1.firebasedatabase.app/voc.json",
      { method: "PUT", body: JSON.stringify(vocStorage) }
    );
  }, [vocStorage]);

  function rememberClickHandler() {
    if (isClickable) return;
    else {
      dispatch(vocActions.removeVocFromList({ eng, chi }));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);
    }
  }

  function storeVoc() {
    if (isClickable) return;
    else {
      dispatch(vocActions.store({ eng, chi }));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);
    }
  }

  async function openDetail(e) {
    if (e.target.tagName === "svg" || e.target.tagName === "path") {
      try {
        const definition = await axios.get(wordnik_definition_URL);
        const definitionResult = definition.data[0].text;

        const exampleSentence = await axios.get(wordnik_example_URL);
        const exampleSentenceResult = exampleSentence.data.text;

        dispatch(
          vocActions.updateDetail({
            definition: definitionResult,
            sentence: exampleSentenceResult,
          })
        );
      } catch (error) {
        console.log(error.message);
      }

      dialogRef.current.showModal();
    } else return;
  }

  return (
    <>
      <li onClick={openDetail} className="voc-item">
        <FontAwesomeIcon icon={faBookOpen} />
        <h2>{eng}</h2>
        <div className="action">
          <Button btnName="Got it" bgRemember onClick={rememberClickHandler} />
          {onHomePage && <Button btnName="Store" bgStore onClick={storeVoc} />}
        </div>
      </li>

      <Modal
        ref={dialogRef}
        vocData={{ eng, chi }}
        definition={vocDetail.definition ?? "not support"}
        sentence={vocDetail.sentence ?? "not support"}
        storeFn={storeVoc}
      />
    </>
  );
};

export default VocabulartItem;
