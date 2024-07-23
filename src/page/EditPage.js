import React from "react";
import { useParams } from "react-router-dom";
import Edit from "../components/vocabulary/Edit";

const EditPage = () => {
  const params = useParams();

  return (
    <>
      <Edit id={params.vocID} />
    </>
  );
};

export default EditPage;
