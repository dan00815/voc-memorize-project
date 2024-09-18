import React, { useState } from "react";
import classes from "./Dictionary.module.scss";
import { translateUrl } from "../asset/url";
import { vocUrl } from "../asset/url";
import axios from "axios";
import Audio from "./UI/Audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { fetchVocData } from "../store/voc-slice";
import { dictiActions } from "../store/dictionary-slice";
import { uiActions } from "../store/ui-slice";
import { hintActions } from "../store/hint-slice";

function checkWord(word) {
  const pattern = /<em>(.*?)<\/em>/g;
  const replaceText = word.replace(pattern, "$1");
  return replaceText;
}

const Dictionary = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const dispatch = useDispatch();
  const isClickable = useSelector((state) => state.hint.isClickable);
  const dictionaryWord = useSelector((state) => state.dictionary.word);
  const dictionaryShow = useSelector((state) => state.dictionary.show);
  const hasResult = useSelector((state) => state.dictionary.hasResult);
  const error = useSelector((state) => state.dictionary.error);
  const repeatError = useSelector((state) => state.ui.error.repeatError);
  const token = useSelector((state) => state.login.info.token);

  function inputHandler(e) {
    setInputValue(e.target.value);
  }

  async function getDictionaryData(keyword) {
    try {
      //中文翻譯
      const translateWord = await axios.get(`${translateUrl}&q=${keyword}`);
      const translateChi =
        translateWord.data.data.translations[0].translatedText;

      //定義
      const defineRes = await axios.get(
        `https://api.wordnik.com/v4/word.json/${keyword}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`
      );
      const define =
        defineRes.data[0].text ||
        defineRes.data[1].text ||
        defineRes.data[2].text;
      const cleanDefine = checkWord(define);

      //定義的中文
      const defineChiRes = await axios.get(`${translateUrl}&q=${cleanDefine}`);
      const defineChi = defineChiRes.data.data.translations[0].translatedText;

      //句子
      const sentenceRes = await axios.get(
        `https://api.wordnik.com/v4/word.json/${keyword}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`
      );
      const sentence = sentenceRes.data.text;
      const cleanSentence = checkWord(sentence);

      //句子的中文
      const sentenceChiRes = await axios.get(
        `${translateUrl}&q=${cleanSentence}`
      );
      const sentenceChi =
        sentenceChiRes.data.data.translations[0].translatedText;

      return {
        translateChi,
        define: cleanDefine,
        defineChi,
        sentence: cleanSentence,
        sentenceChi,
      };
    } catch (error) {
      console.log("取得API資料發生錯誤");
    }
  }

  async function clickHandler() {
    const ClearSearchWord = inputValue.trim().toLowerCase();

    //若是相同查詢，則不重新發送API
    if (ClearSearchWord === searchWord) {
      dispatch(
        uiActions.showRepeatError("Don't enter duplicate or blank words")
      );

      setTimeout(() => {
        dispatch(uiActions.clearRepeatError());
      }, 1000);
    } else {
      const dataObj = await getDictionaryData(ClearSearchWord);

      if (dataObj) {
        setSearchWord(ClearSearchWord);

        dispatch(
          dictiActions.updatedWord({
            eng: ClearSearchWord,
            chi: dataObj.translateChi,
            definition: dataObj.define,
            translateDefi: dataObj.defineChi,
            sentence: dataObj.sentence,
            translateSen: dataObj.sentenceChi,
          })
        );
      } else {
        dispatch(dictiActions.errorHandle());
      }
    }
  }

  function showHint() {
    dispatch(hintActions.storeVoc());
    setTimeout(() => {
      dispatch(hintActions.recoverClickable());
    }, 1500);
  }

  async function addToBox() {
    if (isClickable) return;
    else {
      showHint();

      try {
        await axios.post(
          vocUrl,
          {
            english: dictionaryWord.eng,
            chinese: dictionaryWord.chi,
            definition: dictionaryWord.definition,
            example: dictionaryWord.sentence,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        dispatch(fetchVocData());
      } catch (error) {
        console.log(error.message);
        dispatch(hintActions.recoverStore(error.message));
        setTimeout(() => {
          dispatch(hintActions.clearStoreError());
        }, 1000);
      }
    }
  }

  return (
    <>
      {dictionaryShow && (
        <div className={classes.dictionary}>
          <h1>Dictionary</h1>
          <div className={classes["input-field"]}>
            <input type="text" onChange={inputHandler} />
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={clickHandler} />
          </div>

          {hasResult && (
            <div className={classes.foundResult}>
              <div className={classes.resultContainer}>
                <h2>中文翻譯：{dictionaryWord.chi}</h2>
                <Audio word={dictionaryWord.eng} />

                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={addToBox}
                  className={classes.addIcon}
                />
              </div>

              <h2>定義: {dictionaryWord.definition || "not support"}</h2>
              {dictionaryWord.definition && (
                <span>{dictionaryWord.translateDefi}</span>
              )}

              <h2>例句: {dictionaryWord.sentence || "not support"}</h2>
              {dictionaryWord.sentence && (
                <span>{dictionaryWord.translateSen}</span>
              )}
            </div>
          )}

          {error && <h2>找不到搜尋結果</h2>}

          {repeatError && (
            <div className={classes["repeat-hint"]}>{repeatError}</div>
          )}
        </div>
      )}
    </>
  );
};

export default Dictionary;
