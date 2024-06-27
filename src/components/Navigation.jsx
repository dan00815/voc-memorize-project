import React from "react";
import classes from "./Navigation.module.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Hint from "./Hint";
import logo from "../asset/images/onlylogo.png";
import { useDispatch } from "react-redux";
import { dictiActions } from "../store/dictionary-slice";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { loginActions } from "../store/login-slice";

import { logoutUrl } from "../asset/url";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const show = useSelector((state) => state.dictionary.show);
  const vocRemove = useSelector((state) => state.voc.UIstate.vocRemove);
  const isClickable = useSelector((state) => state.voc.UIstate.isClickable);
  const amountError = useSelector((state) => state.ui.error.amountError);
  const isLogin = useSelector((state) => state.login.info.isAuth);
  const registerInfo = useSelector((state) => state.login.registerInfo);

  function resetDictionary() {
    window.scrollTo(0, 0);
    dispatch(dictiActions.resetDictionary());
  }

  function showDictionaryHandler() {
    dispatch(dictiActions.showDictionary());
  }

  async function signOut() {
    const res = await axios.post(logoutUrl);

    //這裡也要將字典關掉
    dispatch(dictiActions.resetDictionary());

    navigate("/");

    // 將回傳的isAuthenticated 更新redux auth狀態
    dispatch(loginActions.logout(res.data.isAuthenticated));
  }

  let showDic = undefined;
  if (show) {
    showDic = classes.show;
  }

  return (
    <>
      <Navbar className={classes.nav} expand="lg" sticky="top">
        {isClickable && (
          <Hint
            message={vocRemove ? "Good ! Keep Going" : "Put Into Box !"}
            icon={<FontAwesomeIcon icon={faCircleCheck} />}
          />
        )}
        {amountError && (
          <Hint
            message={amountError}
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
          />
        )}
        {registerInfo && (
          <Hint
            message="註冊成功!"
            icon={<FontAwesomeIcon icon={faCircleInfo} />}
          />
        )}

        <Container className={classes.container}>
          <Navbar.Brand>
            <Link to="/" onClick={resetDictionary}>
              <img src={logo} alt="logo" />
              <h1>VOC MEMORIZE</h1>
            </Link>
          </Navbar.Brand>

          {/* 漢堡選單 */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className={classes.hamburgerSvg}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className={`justify-content-end ${classes.navContainer}`}>
              {isLogin && (
                <Link onClick={showDictionaryHandler}>
                  <p className={showDic}>Dictionary</p>
                </Link>
              )}

              {/* BOX({vocFromFirebase.length}) */}

              <NavLink to="/profile" onClick={resetDictionary}>
                {({ isActive }) => (
                  <p className={isActive ? classes.show : undefined}>Profile</p>
                )}
              </NavLink>

              {!isLogin && (
                <NavLink to="/login">
                  {({ isActive }) => (
                    <p className={isActive ? classes.show : undefined}>Login</p>
                  )}
                </NavLink>
              )}

              {!isLogin && (
                <NavLink to="/register">
                  {({ isActive }) => (
                    <p className={isActive ? classes.show : undefined}>
                      Register
                    </p>
                  )}
                </NavLink>
              )}

              {isLogin && (
                <Link onClick={signOut}>
                  <p>Sign out</p>
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
