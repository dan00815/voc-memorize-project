import React from "react";
import classes from "./Edit.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { vocActions } from "../../store/voc-slice";
import { vocUrl } from "../../asset/url";
import axios from "axios";
import { uiActions } from "../../store/ui-slice";
import { fetchVocData } from "../../store/voc-slice";

const Edit = ({ id, tags }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.login.info.token);
  const editWord = useSelector((state) => state.voc.editWord.info);
  const tagsArray = useSelector((state) => state.voc.editWord.tags);

  function goBack() {
    dispatch(uiActions.resetCardMode());
    navigate(`/profile/${tags}`);
  }

  function editHandler(e, detailKey) {
    dispatch(vocActions.editVoc({ [detailKey]: e.target.value }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    let finalEditWord = [];

    dispatch(vocActions.storeEdit());
    dispatch(uiActions.resetCardMode());
    navigate(`/profile/${tags}`);
    alert("修改成功");

    if (!editWord.tags) {
      if (tagsArray.includes("__NoTag")) {
        finalEditWord = { ...editWord };
      } else {
        finalEditWord = { ...editWord, tags: tagsArray };
      }
    } else if (tagsArray.includes("__NoTag")) {
      finalEditWord = { ...editWord, tags: [editWord.tags] };
    } else {
      finalEditWord = { ...editWord, tags: [...tagsArray, editWord.tags] };
    }

    try {
      await axios.patch(vocUrl + id, finalEditWord, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(fetchVocData());
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className={classes.formContainer}>
      <Form className={classes.editForm} onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="editEng">
          <Form.Label>
            <h3>English</h3>
          </Form.Label>
          <Form.Control
            type="text"
            value={editWord.english}
            onChange={(e) => {
              editHandler(e, "english");
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editChi">
          <Form.Label>
            <h3>Chinese</h3>
          </Form.Label>
          <Form.Control
            type="text"
            value={editWord.chinese}
            onChange={(e) => {
              editHandler(e, "chinese");
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editDefinition">
          <Form.Label>
            <h3>Definition</h3>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={editWord.definition}
            onChange={(e) => {
              editHandler(e, "definition");
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editExample">
          <Form.Label>
            <h3>Example</h3>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={editWord.example}
            onChange={(e) => {
              editHandler(e, "example");
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="editTags">
          <Form.Label>
            <h3>Tags</h3>
          </Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => {
              editHandler(e, "tags");
            }}
          />
        </Form.Group>

        <div className={classes.btnContainer}>
          <Button variant="primary" type="submit" className={classes.Btn}>
            提交修改
          </Button>

          <Button onClick={goBack}>返回上一頁</Button>
        </div>
      </Form>
    </div>
  );
};

export default Edit;
