import React, { useEffect } from "react";
import loginImg from "../../asset/images/login.png";
import classes from "./Login.module.scss";
import SpinnerElm from "../UI/Spinner";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../../store/login-slice";

import { loginUrl } from "../../asset/url";
import { uiActions } from "../../store/ui-slice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.login.info.isLogin);
  const errorMsg = useSelector((state) => state.login.errorLoginMsg);
  const spinner = useSelector((state) => state.ui.spinner);

  useEffect(() => {
    dispatch(loginActions.clearError());
  }, [dispatch]);

  async function submitEvent(e) {
    e.preventDefault();

    const fdObj = new FormData(e.target);
    const data = Object.fromEntries(fdObj.entries());

    //登入時等待的過場
    dispatch(uiActions.spinner());

    try {
      const res = await axios.post(loginUrl, data);

      //資料放進reudx方便其他組件使用
      dispatch(
        loginActions.updateLoginState({
          isLogin: res.data.isAuthenticated, //true
          name: res.data.name,
          token: res.data.token,
        })
      );

      dispatch(uiActions.clearSpinner());

      navigate("/profile");
    } catch (error) {
      const errorMsg = error.response.data.message;
      dispatch(uiActions.clearSpinner());
      dispatch(loginActions.updateLoginError(errorMsg));
    }
  }

  return (
    <>
      {spinner && <SpinnerElm phrase="Wait a moment" />}

      {isLogin && (
        <h1
          style={{
            textAlign: "center",
            margin: "10%",
          }}
        >
          已經登入過囉
        </h1>
      )}

      {!isLogin && (
        <Form className={classes.loginForm} onSubmit={submitEvent}>
          {errorMsg && <p>{errorMsg}</p>}

          <Form.Group
            className={`mb-4 ${classes.formGroup}`}
            controlId="formBasicEmail"
          >
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" />
          </Form.Group>

          <Form.Group
            className={`mb-4 ${classes.formGroup}`}
            controlId="formBasicPassword"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>

          <div className={classes.imgContainer}>
            <img src={loginImg} alt="logo" />
          </div>
        </Form>
      )}
    </>
  );
};

export default Login;
