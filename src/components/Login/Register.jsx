import React, { useEffect } from "react";
import registerLogo from "../../asset/images/register.png";
import classes from "./Register.module.scss";
import SpinnerElm from "../UI/Spinner";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "../../store/login-slice";
import axios from "axios";
import { registerUrl } from "../../asset/url";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorMsg = useSelector((state) => state.login.errorRegisterMsg);
  const loadingState = useSelector((state) => state.login.loading);

  async function submitEvent(e) {
    e.preventDefault();

    const fdObj = new FormData(e.target);
    const data = Object.fromEntries(fdObj.entries());

    dispatch(loginActions.loading());

    try {
      await axios.post(registerUrl, data);

      dispatch(loginActions.clearLoading());

      navigate("/login");

      dispatch(loginActions.registerInfo());

      setTimeout(() => {
        dispatch(loginActions.ckearInfo());
      }, 1500);
    } catch (error) {
      console.log(error);
      const errorMsg = error.response.data.message;
      dispatch(loginActions.updateRegisterError(errorMsg));
    }
  }

  return (
    <>
      {loadingState && <SpinnerElm />}

      <Form className={classes.registerForm} onSubmit={submitEvent}>
        {errorMsg && <p>{errorMsg}</p>}

        <Form.Group
          className={`mb-4 ${classes.formGroup}`}
          controlId="formBasicName"
        >
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" />
        </Form.Group>

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

        <Form.Group
          className={`mb-4 ${classes.formGroup}`}
          controlId="formBasicConfirmPassword"
        >
          <Form.Label>Confirm Your Password</Form.Label>
          <Form.Control type="password" name="confirmPassword" />
        </Form.Group>

        <Button variant="primary" type="submit" className={classes.loginBtn}>
          Submit
        </Button>

        <div className={classes.imgContainer}>
          <img src={registerLogo} alt="register" />
        </div>
      </Form>
    </>
  );
};

export default Register;
