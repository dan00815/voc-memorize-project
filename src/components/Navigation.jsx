import React from "react";
import classes from "./Navigation.module.scss";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { Link } from "react-router-dom";
import Hint from "./Hint";
import logo from "../asset/images/onlylogo.png";
import { useDispatch } from "react-redux";
import { dictiActions } from "../store/dictionary-slice";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.dictionary.show);
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);
  const onHomePage = useSelector((state) => state.voc.voc.onHomePage);
  const vocRemove = useSelector((state) => state.voc.vocRemove);
  const isClickable = useSelector((state) => state.voc.isClickable);

  const amountError = useSelector((state) => state.ui.error.amountError);

  function resetDictionary() {
    window.scrollTo(0, 0);
    dispatch(dictiActions.resetDictionary());
  }

  function showDictionaryHandler() {
    dispatch(dictiActions.showDictionary());
  }

  let showClass = undefined;
  let showBox = undefined;
  if (show) {
    showClass = classes.show;
  }
  if (!onHomePage) {
    showBox = classes.show;
  }

  return (
    <>
      <Navbar className={classes.nav} expand="md" sticky="top">
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
              <Link>
                <p onClick={showDictionaryHandler} className={showClass}>
                  Dictionary
                </p>
              </Link>
              <Link to="/box" onClick={resetDictionary}>
                <p className={showBox}>BOX({vocFromFirebase.length})</p>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
