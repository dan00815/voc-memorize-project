import React, { useCallback, useEffect } from "react";
import classes from "./Profile.module.scss";
import VocabulartItem from "./vocabulary/Vocabulary-item";
import ProfileInfo from "./ProfileInfo";
import SpinnerElm from "./UI/Spinner";
import { useSelector, useDispatch } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { Pagination, Button } from "react-bootstrap";
import { uiActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/login-slice";

import Card from "./Card";
import axios from "axios";
import { vocUrl } from "../asset/url";

//有一個funciton判斷現在的media，符合回傳true
function checkMedia() {
  const media = window.matchMedia(
    "(min-width: 768px) and (max-width: 1024px)"
  ).matches;

  return media;
}

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vocStorage = useSelector((state) => state.voc.vocStorage);
  const spinner = useSelector((state) => state.ui.spinner);
  const pagination = useSelector((state) => state.ui.pagintaion);
  const cardMode = useSelector((state) => state.ui.cardModeToggle);
  const totalPage = Math.ceil(vocStorage.length / pagination.perPageAmount);
  const firstLogin = useSelector((state) => state.login.firstLogin);
  const loginState = useSelector((state) => state.login.info.isLogin);
  const token = useSelector((state) => state.login.info.token);

  useEffect(() => {
    async function renderVocStorage() {
      if (token) {
        if (firstLogin) {
          dispatch(uiActions.spinner());
          try {
            const res = await axios.get(`${vocUrl}?start=0&end=-1`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            dispatch(vocActions.replaceVoc(res.data));
            dispatch(loginActions.firstLoginToFalse());
            // 當沒儲存單字時訪問API會失敗，這邊要處理
          } catch (error) {
            dispatch(loginActions.firstLoginToFalse());
            console.log(error);
          }

          dispatch(uiActions.clearSpinner());
        }
      }
    }

    dispatch(vocActions.changeToBox());
    const mobie = checkMedia();
    if (mobie) {
      dispatch(uiActions.updataPerPageAmount(8));
    }
    renderVocStorage();
  }, [firstLogin]);

  //依照當前頁數去抓到我要呈現的單字資料
  const getVoc = useCallback(
    (page) => {
      const startIndex = (page - 1) * pagination.perPageAmount;

      const res = vocStorage.slice(
        startIndex,
        startIndex + pagination.perPageAmount
      );

      //這裡判斷，當前頁面的單字點完時，退回至前一頁
      if (res.length === 0) {
        if (pagination.activePage === 1) {
          dispatch(uiActions.updatedActivePage(1));
        } else {
          dispatch(uiActions.updatedActivePage(pagination.activePage - 1));
        }
      }

      dispatch(uiActions.updatePageVoc(res));
    },
    [dispatch, pagination.perPageAmount, pagination.activePage, vocStorage]
  );

  useEffect(() => {
    getVoc(pagination.activePage);
  }, [dispatch, pagination.activePage, getVoc]);

  function handlePaginationChange(page) {
    dispatch(uiActions.updatedActivePage(page));
  }

  function clickEvent() {
    dispatch(loginActions.clearError());
    navigate("/login");
  }

  return (
    <>
      {!loginState && (
        <div className={classes.msg}>
          <h1>請先登入才能查看個人頁面</h1>
          <Button onClick={clickEvent}>去登入</Button>
        </div>
      )}

      {loginState && (
        <>
          <ProfileInfo />

          {!cardMode && (
            <div className={classes.vocBox}>
              {spinner && <SpinnerElm phrase="Loading Voc Data" />}

              {pagination.boxVoc && (
                <ul>
                  {pagination.boxVoc.map((voc, index) => {
                    return (
                      <VocabulartItem
                        key={index}
                        english={voc.english}
                        chinese={voc.chinese}
                        id={voc.id}
                      />
                    );
                  })}
                </ul>
              )}

              <Pagination className="justify-content-center">
                {totalPage > 1 &&
                  [...Array(totalPage)].map((_, index) => {
                    return (
                      <Pagination.Item
                        key={index}
                        active={index + 1 === pagination.activePage}
                        onClick={() => {
                          handlePaginationChange(index + 1);
                        }}
                      >
                        {index + 1}
                      </Pagination.Item>
                    );
                  })}
              </Pagination>

              {vocStorage.length === 0 && (
                <h1>There are no words in the Box !!!</h1>
              )}
            </div>
          )}

          {cardMode && <Card />}
        </>
      )}
    </>
  );
};

export default Profile;
