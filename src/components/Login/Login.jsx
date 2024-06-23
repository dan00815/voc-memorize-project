import React from "react";
import loginImg from "../../asset/images/login.png";
import classes from "./Login.module.scss";
import SpinnerElm from "../UI/Spinner";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useGetLoginState from "../../HOOKs/useGetLoginState";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../../store/login-slice";

const url = "https://voc-backend-sql.onrender.com/login";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.login.info.isAuth);
  const errorMsg = useSelector((state) => state.login.errorLoginMsg);
  const loadingState = useSelector((state) => state.login.loading);

  useGetLoginState();

  async function submitEvent(e) {
    e.preventDefault();

    const fdObj = new FormData(e.target);
    const data = Object.fromEntries(fdObj.entries());

    //登入時等待的過場
    dispatch(loginActions.loading());

    try {
      const res = await axios.post(url, data);

      //登入成功後會拿到auth = true
      const auth = res.data.isAuthenticated;
      const userName = res.data.name;

      //auth存進localStorage記得
      localStorage.setItem("auth", auth);
      //資料放進reudx方便其他組件使用
      dispatch(
        loginActions.updateLoginState({
          isAuth: auth,
          name: userName,
        })
      );

      //跳轉到box，應該就能看到東西了
      navigate("/profile");
    } catch (error) {
      const errorMsg = error.response.data.message;
      dispatch(loginActions.updateLoginError(errorMsg));
    }
  }

  return (
    <>
      {loadingState && <SpinnerElm />}

      {isAuth && (
        <h1
          style={{
            textAlign: "center",
            margin: "10%",
          }}
        >
          已經登入過囉
        </h1>
      )}

      {!isAuth && (
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

          <Button variant="primary" type="submit" className={classes.loginBtn}>
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
