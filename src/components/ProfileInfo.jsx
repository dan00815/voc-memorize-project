import React from "react";
import classes from "./ProfileInfo.module.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const loginInfo = useSelector((state) => state.login.info);
  const vocAmount = useSelector((state) => state.voc.vocAmount);

  return (
    <div className={classes.profile}>
      <h1>個人資訊頁</h1>
      <h2>
        歡迎 {loginInfo.name}！ 目前已收錄 {vocAmount} 個單字
      </h2>
    </div>
  );
};

export default Profile;
