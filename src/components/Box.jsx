import React, { useCallback, useEffect } from "react";
import classes from "./Box.module.scss";
import VocabulartItem from "../components/vocabulary/Vocabulary-item";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { vocActions } from "../store/voc-slice";
import { Pagination } from "react-bootstrap";
import { uiActions } from "../store/ui-slice";

const Box = () => {
  const dispatch = useDispatch();
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);
  const pagination = useSelector((state) => state.ui.pagintaion);
  const totalPage = Math.ceil(
    vocFromFirebase.length / pagination.perPageAmount
  );

  useEffect(() => {
    dispatch(vocActions.changeToBox());
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

  return (
    <>
      <div className={classes.box}>
        {pagination.boxVoc && (
          <ul>
            {pagination.boxVoc.map((voc, index) => {
              return <VocabulartItem key={index} eng={voc.eng} chi={voc.chi} />;
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
      <br />
    </>
  );
};

export default Box;
