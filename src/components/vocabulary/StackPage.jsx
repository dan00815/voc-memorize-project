import React, { useCallback, useEffect } from "react";
import classes from "./StackPage.module.scss";
import { Pagination, Button, Stack } from "react-bootstrap";
import VocabulartItem from "./Vocabulary-item";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Card from "../Card";
import Notification from "../UI/Notification";

//判斷現在的media query，改變不同裝置profile呈現的單字數量
function checkMedia() {
  const media = window.matchMedia(
    "(min-width: 768px) and (max-width: 1024px)"
  ).matches;

  return media;
}

const StackPage = ({ tags }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const pagination = useSelector((state) => state.ui.pagintaion);
  const selectedCardStack = useSelector((state) => state.voc.selectedCardStack);
  const totalPage = Math.ceil(
    selectedCardStack.vocabularies.length / pagination.perPageAmount
  );
  const cardMode = useSelector((state) => state.ui.cardModeToggle);

  const getVoc = useCallback(
    (page) => {
      const startIndex = (page - 1) * pagination.perPageAmount;

      const res = selectedCardStack.vocabularies.slice(
        startIndex,
        startIndex + pagination.perPageAmount
      );

      if (res.length === 0) {
        if (pagination.activePage === 1) {
          dispatch(uiActions.updatedActivePage(1));
        } else {
          dispatch(uiActions.updatedActivePage(pagination.activePage - 1));
        }
      }

      dispatch(uiActions.updatePageVoc(res));
    },
    [
      dispatch,
      selectedCardStack,
      pagination.activePage,
      pagination.perPageAmount,
    ]
  );

  useEffect(() => {
    getVoc(pagination.activePage);
  }, [getVoc]);

  useEffect(() => {
    const mobie = checkMedia();
    if (mobie) {
      dispatch(uiActions.updataPerPageAmount(8));
    }
  }, []);

  useEffect(() => {
    if (selectedCardStack.vocabularies.length === 0) {
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    }
  }, [selectedCardStack.vocabularies.length]);

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

  function handlePaginationChange(page) {
    dispatch(uiActions.updatedActivePage(page));
  }

  function goBack() {
    dispatch(uiActions.resetCardMode());
    navigate("/profile");
  }

  function handleToggle() {
    dispatch(uiActions.changeCardMode());
  }

  return (
    <>
      <div className={classes.stackPageInfo}>
        <h1>{tags}</h1>

        <div className={classes.mode}>
          <h2>Card Mode</h2>
          <Form className={classes.form}>
            <Form.Check
              type="switch"
              id="custom-switch"
              onClick={handleToggle}
            />
          </Form>
        </div>
      </div>

      {/* 非卡片模式的profile頁面 */}
      {!cardMode && (
        <span>
          <ul className={classes.cardContainer}>
            {pagination.boxVoc.map((vocDetail, index) => {
              return (
                <VocabulartItem
                  key={index}
                  english={vocDetail.english}
                  chinese={vocDetail.chinese}
                  definition={vocDetail.definition}
                  example={vocDetail.example}
                  id={vocDetail.vocId}
                  tags={tags}
                />
              );
            })}
          </ul>

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
        </span>
      )}

      {cardMode && <Card tags={tags} />}

      <Stack gap={3} className="col-md-2 mx-auto">
        <Button variant="info" onClick={goBack} className="">
          返回上一頁
        </Button>
      </Stack>
    </>
  );
};

export default StackPage;
