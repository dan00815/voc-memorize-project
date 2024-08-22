import React, { useEffect } from "react";
import classes from "./Profile.module.scss";
import ProfileInfo from "./ProfileInfo";
import CardStack from "./vocabulary/CardStack";
import Notification from "./UI/Notification";
import { useSelector, useDispatch } from "react-redux";
import { fetchVocData, vocActions } from "../store/voc-slice";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginActions } from "../store/login-slice";
import { uiActions } from "../store/ui-slice";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.login.info.token);
  const status = useSelector((state) => state.voc.status);
  const vocData = useSelector((state) => state.voc.vocData);

  useEffect(() => {
    if (token) {
      if (status === "idle") {
        dispatch(fetchVocData());
      }
    }

    dispatch(uiActions.resetCardMode());
  }, [dispatch, token, status]);

  function clickEvent() {
    dispatch(loginActions.clearError());
    navigate("/login");
  }

  if (!token) {
    return (
      <div className={classes.msg}>
        <h1>請先登入才能查看個人頁面</h1>
        <Button onClick={clickEvent}>去登入</Button>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Notification title="Connect to Box failed..." status="error" />
      </div>
    );
  }

  return (
    <>
      <ProfileInfo />

      <div className={classes.cardStackContainer}>
        {vocData.length !== 0 &&
          vocData.map((stack, index) => {
            return <CardStack key={index} tags={stack.name} />;
          })}

        {vocData.length === 0 && <h1>There are no words in the Box !!!</h1>}
      </div>
    </>
  );
};

export default Profile;
