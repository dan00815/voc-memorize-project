import React from "react";
import { Link } from "react-router-dom";
import logo from "../asset/images/onlylogo.png";
import { useDispatch } from "react-redux";
import { dictiActions } from "../store/dictionary-slice";
import { useSelector } from "react-redux";

const Nav = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.dictionary.show);
  const vocFromFirebase = useSelector((state) => state.voc.vocStorage);

  function resetDictionary() {
    window.scrollTo(0, 0);
    dispatch(dictiActions.resetDictionary());
  }

  function showDictionaryHandler() {
    dispatch(dictiActions.showDictionary());
  }
  let showClas = "";
  if (show) {
    showClas = "show";
  }

  return (
    <nav>
      <Link to="/" onClick={resetDictionary}>
        <img src={logo} alt="logo" />
        <h1>VOC MEMORIZE</h1>
      </Link>

      <ul>
        <li onClick={showDictionaryHandler} className={showClas}>
          Dictionary
        </li>
        <Link to="/box" onClick={resetDictionary}>
          <li>BOX({vocFromFirebase.length})</li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
