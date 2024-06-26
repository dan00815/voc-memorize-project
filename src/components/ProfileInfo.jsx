import React from "react";
import classes from "./ProfileInfo.module.scss";
import { useSelector } from "react-redux";
// import axios from "axios";
// import { backendHome } from "../asset/url";

const Profile = () => {
  const loginInfo = useSelector((state) => state.login.info);

  async function test() {
    // try {
    //   const res = await axios.get(backendHome);
    //   console.log(res);
    // } catch (error) {
    //   console.log(error);
    // }
    const aa = window.matchMedia("(max-width: 599px)").matches;
    console.log(aa);
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
