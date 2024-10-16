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
import { hintActions } from "../../store/hint-slice";

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

    dispatch(uiActions.spinner());

    try {
      const res = await axios.post(loginUrl, data);

      //資料放進reudx方便其他組件使用
      dispatch(
        loginActions.updateLoginState({
          isLogin: res.data.isAuthenticated,
          name: res.data.name,
          token: res.data.token,
        })
      );

      dispatch(uiActions.clearSpinner());
      dispatch(hintActions.changeToBox());
      navigate("/profile");
    } catch (error) {
      let errorMsg = "";
      if (error.response.data.message === undefined) {
        errorMsg = "帳號或密碼未填寫";
      } else errorMsg = error.response.data.message;

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

          <div className={classes.loginBtn}>
            <Button variant="primary" type="submit">
              Submit
              
            </Button>

            <Button
              variant="light"
              href=" https://vocab-memorizer-backend.onrender.com/api/v1/auth/google"
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="google"
              />
              透過Google登入
            </Button>
          </div>

          <div className={classes.imgContainer}>
            <img src={loginImg} alt="logo" />
          </div>
        </Form>
      )}
    </>
  );
};

export default Login;
