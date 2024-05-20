import React, { useRef } from "react";
import { translateUrl } from "../asset/url";
import axios from "axios";
import Input from "./UI/Input";
import Audio from "./Audio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useSelector, useDispatch } from "react-redux";
import { dictiActions } from "../store/dictionary-slice";
import { uiActions } from "../store/ui-slice";

const Dictionary = () => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const dictionaryWord = useSelector((state) => state.dictionary.word);
  const dictionaryShow = useSelector((state) => state.dictionary.show);
  const hasResult = useSelector((state) => state.dictionary.hasResult);
  const inputWord = useSelector((state) => state.dictionary.word.eng);
  const error = useSelector((state) => state.dictionary.error);
  const repeatError = useSelector((state) => state.ui.error.repeatError);

  async function getDictionaryData(keyword) {
    try {
      //單字的中文翻譯
      const translateWord = await axios.get(`${translateUrl}&q=${keyword}`);
      const translateChi =
        translateWord.data.data.translations[0].translatedText;

      //拿定義
      const defineRes = await axios.get(
        `https://api.wordnik.com/v4/word.json/${keyword}/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=${process.env.REACT_APP_WORDNIK_API}`
      );
      const define =
        defineRes.data[0].text ||
        defineRes.data[1].text ||
        defineRes.data[2].text;

      //定義的中文
      const defineChiRes = await axios.get(`${translateUrl}&q=${define}`);
      const defineChi = defineChiRes.data.data.translations[0].translatedText;

      //拿句子
      const sentenceRes = await axios.get(
        `https://api.wordnik.com/v4/word.json/${keyword}/topExample?useCanonical=false&api_key=${process.env.REACT_APP_WORDNIK_API}`
      );
      const sentence = sentenceRes.data.text;

      //拿句子的中文
      const sentenceChiRes = await axios.get(`${translateUrl}&q=${sentence}`);
      const sentenceChi =
        sentenceChiRes.data.data.translations[0].translatedText;

      return {
        translateChi,
        define,
        defineChi,
        sentence,
        sentenceChi,
      };
    } catch (error) {
      console.log("取得API資料發生錯誤");
    }
  }

  async function clickHandler(e) {
    try {
      const searchWord = inputRef.current.value.trim().toLowerCase();

      //若是相同查詢，則不重新發送API
      if (searchWord === inputWord) {
        dispatch(
          uiActions.showRepeatError("Don't enter duplicate or blank words")
        );

        setTimeout(() => {
          dispatch(uiActions.clearRepeatError());
        }, 1000);
        return;
      }

      //用Input內單字做搜尋
      const dataObj = await getDictionaryData(searchWord);

      //將所有得來的資料放進去更新state
      dispatch(
        dictiActions.updatedWord({
          eng: searchWord,
          chi: dataObj.translateChi,
          definition: dataObj.define,
          translateDefi: dataObj.defineChi,
          sentence: dataObj.sentence,
          translateSen: dataObj.sentenceChi,
        })
      );
    } catch (error) {
      dispatch(dictiActions.errorHandle());
    }
  }

  return (
    <>
      {dictionaryShow && (
        <div className="dictionary">
          <h1>Dictionary</h1>
          <div className="input-field">
            <Input type="text" ref={inputRef} />
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={clickHandler} />
          </div>

          {hasResult && (
            <div className="foundResult">
              <div style={{ display: "flex", alignItems: "center" }}>
                <h2>中文翻譯 : {dictionaryWord.chi}</h2>
                <Audio word={inputRef.current.value} />
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
          {error && <h1>找不到搜尋結果</h1>}

          {repeatError && <div className="repeat-hint">{repeatError}</div>}
        </div>
      )}
    </>
  );
};

export default Dictionary;
