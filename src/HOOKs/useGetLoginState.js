import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginActions } from "../store/login-slice";

const useGetLoginState = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuth = localStorage.getItem("auth");

    if (isAuth) {
      dispatch(loginActions.updateAuth(isAuth));
    }
  }, [dispatch]);

  return;
};

export default useGetLoginState;
