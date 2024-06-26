import React, { useCallback, useEffect } from "react";
import classes from "./Profile.module.scss";
import VocabulartItem from "./vocabulary/Vocabulary-item";
import ProfileInfo from "./ProfileInfo";
import { useSelector, useDispatch } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { Pagination, Button } from "react-bootstrap";
import { uiActions } from "../store/ui-slice";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/login-slice";

//有一個funciton判斷現在的media，符合回傳true
function checkMedia() {
  const media = window.matchMedia(
    "(min-width: 768px) and (max-width: 1024px)"
  ).matches;

  return media;
}

const Box = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);
  const isLoginState = useSelector((state) => state.login.info.isAuth);
  const pagination = useSelector((state) => state.ui.pagintaion);
  const totalPage = Math.ceil(
    vocFromFirebase.length / pagination.perPageAmount
  );

  useEffect(() => {
    dispatch(vocActions.changeToBox());

    const mobie = checkMedia();
    if (mobie) {
      dispatch(uiActions.updataPerPageAmount(8));
    }
  });

  //依照當前頁數去抓到我要呈現的單字資料
  const getVoc = useCallback(
    (page) => {
      const startIndex = (page - 1) * pagination.perPageAmount;

      const res = vocFromFirebase.slice(
        startIndex,
        startIndex + pagination.perPageAmount
      );

      //這裡判斷，當前頁面的單字點完時，退回至前一頁
      if (res.length === 0) {
        if (pagination.activePage === 1) {
          dispatch(uiActions.updatedActivePage(1));
        } else {
          console.log(pagination.activePage);
          dispatch(uiActions.updatedActivePage(pagination.activePage - 1));
        }
      }

      dispatch(uiActions.updatePageVoc(res));
    },
    [pagination.perPageAmount, vocFromFirebase, dispatch, pagination.activePage]
  );

  useEffect(() => {
    getVoc(pagination.activePage);
  }, [
    dispatch,
    getVoc,
    pagination.activePage,
    totalPage,
    vocFromFirebase,
    pagination.perPageAmount,
    pagination.boxVoc.length,
  ]);

  function handlePaginationChange(page) {
    dispatch(uiActions.updatedActivePage(page));
  }

  function clickEvent() {
    dispatch(loginActions.clearError());
    navigate("/login");
  }

  return (
    <>
      {!isLoginState && (
        <div className={classes.msg}>
          <h1>請先登入才能查看個人頁面</h1>
          <Button onClick={clickEvent}>去登入</Button>
        </div>
      )}

      {isLoginState && (
        <>
          <ProfileInfo />

          <div className={classes.box}>
            {pagination.boxVoc && (
              <ul>
                {pagination.boxVoc.map((voc, index) => {
                  return (
                    <VocabulartItem key={index} eng={voc.eng} chi={voc.chi} />
                  );
                })}
              </ul>
            )}

            {vocFromFirebase.length === 0 && (
              <h1>There are no vocabulary in the Box !!!</h1>
            )}
          </div>

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
        </>
      )}
    </>
  );
};

export default Box;
