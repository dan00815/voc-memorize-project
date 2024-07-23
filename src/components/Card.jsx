import React from "react";
import { vocUrl } from "../asset/url";
import "swiper/css/bundle";
import classes from "./card.module.scss";
import Button from "./UI/Button";
// import Audio from "./UI/Audio";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { hintActions } from "../store/hint-slice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Card = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const isClickable = useSelector((state) => state.hint.isClickable);
  const token = useSelector((state) => state.login.info.token);

  // Card裡面的remember，就不用區分homepage了
  async function rememberClickHandler(vocData) {
    if (isClickable) return;
    else {
      dispatch(vocActions.removeFromBox(vocData.id));

      dispatch(hintActions.removeVoc());
      setTimeout(() => {
        dispatch(hintActions.recoverClickable());
      }, 1500);

      try {
        await axios.delete(vocUrl + vocData.id, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

    navigate(`/edit/${word.id}`);
  }

  return (
    <div className={classes.card}>
      {vocStorage.length === 0 && <h1>There are no words in the Box !!!</h1>}

      {vocStorage.length !== 0 && (
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
          {vocStorage.map((voc) => {
            return (
              <SwiperSlide className={classes.swiperSlide} key={voc.id}>
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
                  <p>定義 : {voc.definition}</p>
                  <p>例句: {voc.example}</p>
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
      )}
    </div>
  );
};

export default Card;
