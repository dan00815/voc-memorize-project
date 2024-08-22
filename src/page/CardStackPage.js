import React from "react";
import { useParams } from "react-router-dom";
import StackPage from "../components/vocabulary/StackPage.jsx";

const CardStackPage = () => {
  const params = useParams();

  return (
    <>
      <StackPage tags={params.tags} />
    </>
  );
};

export default CardStackPage;
