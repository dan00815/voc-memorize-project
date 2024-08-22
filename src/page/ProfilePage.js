import Dictionary from "../components/Dictionary";
import Profile from "../components/Profile";
import { useSelector } from "react-redux";
import SpinnerElm from "../components/UI/Spinner";

const ProfilePage = () => {
  const status = useSelector((state) => state.voc.status);

  if (status === "loading") {
    return <SpinnerElm phrase="Loading Voc Data" />;
  }

  return (
    <>
      <Profile />
      <Dictionary />
    </>
  );
};

export default ProfilePage;
