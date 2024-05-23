import React, { useEffect } from "react";
import axios from "axios";

import VocabulartItem from "./Vocabulart-item";
import Controller from "./Controller";
import Notification from "../UI/Notification";
import { wordnik_URL, translateUrl } from "../../asset/url";

import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { vocActions } from "../../store/voc-slice";

const Vocabulary = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const VOC_DATA = useSelector((state) => state.voc.voc);
  const vocAmount = useSelector((state) => state.voc.vocAmount);
  const vocChange = useSelector((state) => state.voc.vocChange);

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch(vocActions.resetVoc());

        dispatch(
          uiActions.showNotification({
            status: "sending",
            title: "Fetching VOC data from API...",
          })
        );

        const res = await axios.get(`${wordnik_URL}&limit=${vocAmount}`);
        const vocData = res.data;

        const onlyWordData = vocData.map((voc) => {
          return voc.word;
        });

        //wordnikAPI返回後，翻譯成中文
        const translateArray = onlyWordData.map(async (item) => {
          const translateRes = await axios.get(`${translateUrl}&q=${item}`);
          const translateData = translateRes.data;
          const lastTranslateData =
            translateData.data.translations[0].translatedText;
          return lastTranslateData;
        });

        const resolvedTranslateArray = await Promise.all(translateArray);

        //翻譯完成後，一次更新state，中英文data都放進去
        dispatch(
          vocActions.updateVoc({
            eng: onlyWordData,
            chi: resolvedTranslateArray,
          })
        );

        //都完成後才讓過場動畫消失
        dispatch(
          uiActions.showNotification({
            status: null,
          })
        );
      } catch (error) {
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Fetching  data failed...",
          })
        );
      }
    }

    fetchData();
  }, [dispatch, vocAmount, vocChange]);

  return (
    <div>
      <Controller />

      <div className="voc-container">
        {notification && (
          <Notification
            title={notification.title}
            status={notification.status}
          />
        )}

        <ul>
          {VOC_DATA.eng &&
            VOC_DATA.eng.map((vocItem, index) => {
              return (
                <VocabulartItem
                  key={index}
                  eng={vocItem}
                  chi={VOC_DATA.chi[index]}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Vocabulary;
