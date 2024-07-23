import React from "react";
import classes from "./Edit.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button } from "react-bootstrap";
import { vocActions } from "../../store/voc-slice";
import { vocUrl } from "../../asset/url";
import axios from "axios";
import { uiActions } from "../../store/ui-slice";

const Edit = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.login.info.token);
  const editWord = useSelector((state) => state.voc.editWord);

  function goBack() {
    dispatch(uiActions.resetCardMode());
    navigate("/profile");
  }

  function editHandler(e, detailKey) {
    dispatch(vocActions.editVoc({ [detailKey]: e.target.value }));
  }

  async function submitHandler(e) {
    e.preventDefault();

    dispatch(vocActions.storeEdit());

    navigate("/profile");
    alert("修改成功");

    try {
      await axios.patch(vocUrl + id, editWord, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error);
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
