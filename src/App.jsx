import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Homepage from "./page/Homepage";
import ProfilePage from "./page/ProfilePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import EditPage from "./page/EditPage";
import Error from "./page/Error";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginActions } from "./store/login-slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loginActions.firstLoginToTrue());
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/edit/:vocID" element={<EditPage />}></Route>
            <Route path="*" element={<Error />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
