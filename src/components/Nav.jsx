import React from "react";
import { Link } from "react-router-dom";
import logo from "../asset/images/onlylogo.png";
import { useDispatch } from "react-redux";
import { dictiActions } from "../store/dictionary-slice";
import { useSelector } from "react-redux";

import Hint from "./Hint";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.dictionary.show);
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);
  const onHomePage = useSelector((state) => state.voc.voc.onHomePage);
  const vocRemove = useSelector((state) => state.voc.vocRemove);
  const isClickable = useSelector((state) => state.voc.isClickable);

  function resetDictionary() {
    window.scrollTo(0, 0);
    dispatch(dictiActions.resetDictionary());
  }

  function showDictionaryHandler() {
    dispatch(dictiActions.showDictionary());
  }

  let showClass = "";
  let showBox = "";
  if (show) {
    showClass = "show";
  }
  if (!onHomePage) {
    showBox = "show";
  }

  return (
    <nav>
      <Link to="/" onClick={resetDictionary}>
        <img src={logo} alt="logo" />
        <h1>VOC MEMORIZE</h1>
      </Link>

      {isClickable && (
        <Hint
          message={vocRemove ? "Good ! Keep Going" : "Put Into Box !"}
          icon={<FontAwesomeIcon icon={faCircleCheck} />}
        />
      )}

      <ul>
        <li onClick={showDictionaryHandler} className={showClass}>
          Dictionary
        </li>
        <Link to="/box" onClick={resetDictionary}>
          <li className={showBox}>BOX({vocFromFirebase.length})</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
