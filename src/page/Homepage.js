import React from "react";
import Vocabulary from "../components/vocabulary/Vocabulary";
import Dictionary from "../components/Dictionary";
import { useDispatch } from "react-redux";
import { loginActions } from "../store/login-slice";
import useGetLoginState from "../HOOKs/useGetLoginState";

const Homepage = () => {
  const dispatch = useDispatch();

  const loginState = useGetLoginState();
  dispatch(loginActions.updateAuth(loginState));

  return (
    <>
      <Vocabulary />
      <Dictionary />
    </>
  );
};

export default Homepage;
