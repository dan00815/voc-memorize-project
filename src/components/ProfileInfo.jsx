import React from "react";
import classes from "./ProfileInfo.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { uiActions } from "../store/ui-slice";

const Profile = () => {
  const dispatch = useDispatch();
  const loginInfo = useSelector((state) => state.login.info);
  const vocAmount = useSelector((state) => state.voc.vocStorage.length);

  const handleToggle = () => {
    dispatch(uiActions.changeCardMode());
  };

  return (
    <div className={classes.profile}>
      <h1>個人資訊頁</h1>
      <h2>
        歡迎 {loginInfo.name}！ 目前已收錄 {vocAmount} 個單字
      </h2>

      <div className={classes.mode}>
        <h2>Card Mode</h2>
        <Form className={classes.form}>
          <Form.Check type="switch" id="custom-switch" onClick={handleToggle} />
        </Form>
      </div>
    </div>
  );
};

export default Profile;
