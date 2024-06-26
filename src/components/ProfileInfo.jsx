import React from "react";
import classes from "./ProfileInfo.module.scss";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const loginInfo = useSelector((state) => state.login.info);

  async function test() {
    const res = await axios.post(
      "https://voc-backend-sql.onrender.com/vocabularies"
    );
    console.log(res.data);
  }

  return (
    <div className={classes.profile}>
      <h1 onClick={test}>個人資訊頁</h1>
      <h2>
        歡迎 {loginInfo.name}！ 目前已收錄 {loginInfo.vocStorage} 個單字
      </h2>
    </div>
  );
};

export default Profile;

//可以取得persist lcoalstorage的資料
// const res = localStorage.getItem("persist:root");
// const loginInfo = JSON.parse(res).login;
// console.log(JSON.parse(loginInfo));
//const loaginState = JSON.parse(loginInfo).info.isAuth
