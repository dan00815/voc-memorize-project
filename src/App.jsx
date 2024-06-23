import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./page/Layout";
import Homepage from "./page/Homepage";
import ProfilePage from "./page/ProfilePage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import Error from "./page/Error";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { vocActions } from "./store/voc-slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadVoc = async () => {
      try {
        const res = await fetch(
          "https://vocabulary-project-422108-default-rtdb.asia-southeast1.firebasedatabase.app/voc.json"
        );
        if (!res.ok) {
          throw new Error("load voc error");
        }

        const data = await res.json();
        dispatch(vocActions.replaceVoc(data));
      } catch (error) {
        console.log("抓資料錯誤");
      }
    };

    loadVoc();
  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Homepage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="*" element={<Error />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
