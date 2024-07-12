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
import { vocActions } from "../store/voc-slice";
import { uiActions } from "../store/ui-slice";

const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const show = useSelector((state) => state.dictionary.show);
  const vocRemove = useSelector(
    (state) => state.voc.UIstate.hintState.vocRemove
  );
  const isClickable = useSelector((state) => state.voc.UIstate.isClickable);
  const amountError = useSelector((state) => state.ui.error.amountError);
  const loginState = useSelector((state) => state.login.info.isLogin);
  const registerInfo = useSelector((state) => state.login.registerInfo);

  function resetDictionary() {
    window.scrollTo(0, 0);
    dispatch(dictiActions.resetDictionary());
  }

  function showDictionaryHandler() {
    dispatch(dictiActions.showDictionary());
  }

  function changeToProfile() {
    resetDictionary();
    dispatch(uiActions.resetCardMode());
  }

  async function signOut() {
    //這裡也要將字典關掉
    dispatch(dictiActions.resetDictionary());
    //isLogin改成登出
    dispatch(loginActions.logout());
    //重置卡片模式
    dispatch(uiActions.resetCardMode());
    //把BOX的卡片都先清掉，才不會登入不同帳號時，還看的到前一個帳號的資料
    dispatch(vocActions.replaceVoc([]));
  }

  let showDic = undefined;
  if (show) {
    showDic = classes.show;
  }

  return (
    <>
      <Navbar className={classes.nav} expand="lg" sticky="top">
        {isClickable && (
          <Hint icon={<FontAwesomeIcon icon={faCircleCheck} />} />
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
              {loginState && (
                <Link onClick={showDictionaryHandler}>
                  <p className={showDic}>Dictionary</p>
                </Link>
              )}

              <NavLink to="/profile" onClick={changeToProfile}>
                {({ isActive }) => (
                  <p className={isActive ? classes.show : undefined}>Profile</p>
                )}
              </NavLink>

              {!loginState && (
                <NavLink to="/login">
                  {({ isActive }) => (
                    <p className={isActive ? classes.show : undefined}>Login</p>
                  )}
                </NavLink>
              )}

              {!loginState && (
                <NavLink to="/register">
                  {({ isActive }) => (
                    <p className={isActive ? classes.show : undefined}>
                      Register
                    </p>
                  )}
                </NavLink>
              )}

              {loginState && (
                <Link onClick={signOut} to="/">
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
