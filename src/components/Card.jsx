import React, { useEffect } from "react";
import "swiper/css/bundle";
import { vocUrl } from "../asset/url";
import classes from "./card.module.scss";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { EffectCards, Navigation } from "swiper/modules";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import Button from "./UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { vocActions } from "../store/voc-slice";
import axios from "axios";

const Card = () => {
  const dispatch = useDispatch();
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const isClickable = useSelector((state) => state.voc.UIstate.isClickable);
  const token = useSelector((state) => state.login.info.token);

  // Card裡面的remember，就不用區分homepage了
  async function rememberClickHandler(vocData) {
    if (isClickable) return;
    else {
      dispatch(vocActions.removeVocFromList(vocData.english));

      setTimeout(() => {
        dispatch(vocActions.recoverClickable());
      }, 1500);

      try {
        axios.delete(vocUrl + vocData.id, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className={classes.card}>
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
          {vocStorage.map((voc, index) => {
            return (
              <SwiperSlide className={classes.swiperSlide} key={index}>
                <h3>
                  {voc.english} {voc.chinese}
                </h3>

                <div className={classes.detailMsg}>
                  <p>
                    定義 : stubbornly and vigorously resisting in the face of
                    seemingly hopeless odds
                  </p>
                  <p>
                    例句: Kicking and screaming I might add as I have been an IE
                    diehard from the very beginning of time diehard from the
                    very beginning of time
                  </p>
                </div>

                <Button
                  btnName="Got it"
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

      {vocStorage.length === 0 && <h1>There are no words in the Box !!!</h1>}
    </div>
  );
};

export default Card;
