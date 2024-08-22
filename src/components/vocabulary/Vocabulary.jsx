import React, { useEffect } from "react";
import classes from "./Vocabulary.module.scss";
import axios from "axios";
import VocabulartItem from "./Vocabulary-item";
import Notification from "../UI/Notification";
import { dailyUrl } from "../../asset/url";

import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { hintActions } from "../../store/hint-slice";
import { homeVocActions } from "../../store/homePageVoc.slice";

const Vocabulary = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);
  const homeVocData = useSelector((state) => state.homeVoc.vocData);

  useEffect(() => {
    async function fetchData() {
      dispatch(hintActions.changeToHome());

      if (homeVocData.length !== 0) return;
      else {
        try {
          dispatch(
            uiActions.showNotification({
              status: "sending",
              title: "Fetching VOC data from API...",
            })
          );

          //抓單字，更新redux，放進localstorage，記得狀態
          const res = await axios.get(dailyUrl);

          dispatch(homeVocActions.updateVocData(res.data));

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
    }

    fetchData();
  }, [dispatch]);

  return (
    <>
      <h2 className={classes.title}>Vocabulary</h2>

      <div className={classes.vocContainer}>
        {notification && (
          <Notification
            title={notification.title}
            status={notification.status}
          />
        )}

        <ul>
          {homeVocData &&
            homeVocData.map((voc, index) => {
              return (
                <VocabulartItem
                  key={index}
                  index={index}
                  english={voc.data.english}
                  chinese={voc.data.chinese}
                  definition={voc.data.definition}
                  example={voc.data.example}
                />
              );
            })}
        </ul>
      </div>
    </>
  );
};

export default Vocabulary;
