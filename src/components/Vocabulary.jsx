import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import VocabulartItem from "./Vocabulart-item";
import Controller from "./Controller";
import Notification from "./UI/Notification";
import Hint from "./Hint";
import { wordnik_URL, translateUrl } from "../asset/url";

import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { vocActions } from "../store/voc-slice";

const Vocabulary = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const VOC_DATA = useSelector((state) => state.voc.voc.eng);
  const TRANSLATE_VOC_DATA = useSelector((state) => state.voc.voc.chi);
  const vocAmount = useSelector((state) => state.voc.vocAmount);
  const vocChange = useSelector((state) => state.voc.vocChange);
  const vocRemove = useSelector((state) => state.voc.vocRemove);

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

        const res = await fetch(`${wordnik_URL}&limit=${vocAmount}`);
        if (!res.ok) {
          throw new Error("Fetching VOC data failed");
        }

        const vocData = await res.json();

        const onlyWordData = vocData.map((voc) => {
          return voc.word;
        });

        //wordnikAPI返回後，翻譯成中文
        const translateArray = onlyWordData.map(async (item) => {
          const translateRes = await fetch(`${translateUrl}&q=${item}`);
          const translateData = await translateRes.json();
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
  }, [dispatch, vocAmount, vocChange]); //有需要更新單字的話才...

  return (
    <div>
      <Controller />
      {vocRemove && (
        <Hint
          message="Good! Keep Going"
          icon={<FontAwesomeIcon icon={faCircleCheck} />}
        />
      )}

      <div className="voc-container">
        {notification && (
          <Notification
            title={notification.title}
            status={notification.status}
          />
        )}
        {/*vodData是{ eng: ["english","english"], chi:["中文","中文"] }*/}
        <ul>
          {VOC_DATA &&
            VOC_DATA.map((vocItem, index) => {
              return (
                <VocabulartItem
                  key={index}
                  index={index}
                  eng={vocItem}
                  chi={TRANSLATE_VOC_DATA[index]}
                  VocObj={{
                    eng: VOC_DATA[index],
                    chi: TRANSLATE_VOC_DATA[index],
                  }}
                />
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Vocabulary;
