import React from "react";
import classes from "./ProfileInfo.module.scss";
import { useSelector } from "react-redux";

const Profile = () => {
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);
  const userName = useSelector((state) => state.login.info.name);

  return (
    <div className={classes.profile}>
      <h1>個人資訊頁</h1>
      <h2>
        歡迎 {userName}！ 目前已收錄 {vocFromFirebase.length} 個單字
      </h2>
    </div>
  );
};

export default Profile;
