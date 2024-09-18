import React, { useEffect } from "react";
import { vocUrl } from "../asset/url";
import "swiper/css/bundle";
import classes from "./Card.module.scss";
import Button from "./UI/Button";
import Notification from "./UI/Notification";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { vocActions, fetchVocData } from "../store/voc-slice";
import { hintActions } from "../store/hint-slice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Card = ({ tags }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isClickable = useSelector((state) => state.hint.isClickable);
  const token = useSelector((state) => state.login.info.token);
  const selectedCardStack = useSelector((state) => state.voc.selectedCardStack);

  useEffect(() => {
    if (selectedCardStack.vocabularies.length === 0) {
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [selectedCardStack.vocabularies.length, navigate]);

  if (selectedCardStack.vocabularies.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Notification
          title="該標籤內已無單字，三秒後將返回個人頁面"
          status="error"
        />
      </div>
    );
  }

  // Card裡面的remember，不區分homepage
  async function rememberClickHandler(vocData) {
    if (isClickable) return;
    else {
      dispatch(vocActions.removeFromBox(vocData.vocId));

      dispatch(hintActions.removeVoc());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
      }, 1500);

      try {
        await axios.delete(vocUrl + vocData.vocId, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch(fetchVocData());
      } catch (error) {
        dispatch(vocActions.cancelRemove(vocData));

        dispatch(hintActions.recoverRemove(error.message));
        setTimeout(() => {
          dispatch(hintActions.clearRemoveError());
        }, 1000);
      }
    }
  }

  function editWord(word) {
    dispatch(vocActions.updateEditWord(word));

    navigate(`edit/${word.vocId}`);
  }

  return (
    <div className={classes.card}>
      <Swiper
        effect={"cards"}
        modules={[EffectCards, Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        grabCursor={true}
        loop={true}
        className={classes.swiper}
      >
        {selectedCardStack.vocabularies.map((voc) => {
          return (
            <SwiperSlide className={classes.swiperSlide} key={voc.vocId}>
              <header>
                <h3>
                  {voc.english} {voc.chinese}
                </h3>

                <FontAwesomeIcon
                  icon={faPen}
                  className={classes.pen}
                  onClick={() => {
                    editWord(voc);
                  }}
                />
              </header>

              <div className={classes.detailMsg}>
                <p>
                  {voc.definition}
                  {voc.definition}
                </p>
              </div>

              <Button
                btnName={"Got it"}
                bgRemember
                onClick={() => {
                  rememberClickHandler(voc);
                }}
              />
            </SwiperSlide>
          );
        })}

        <div className={`swiper-button-prev ${classes.prev}`}></div>
        <div className={`swiper-button-next ${classes.next}`}></div>
      </Swiper>
    </div>
  );
};

export default Card;
