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
  //selectedTagsArray內有好幾筆單字資訊(含eng，tags)，元素類型為物件
  const selectedTagsArray = useSelector((state) => state.voc.editWord.tags);
  const selectedObj = selectedTagsArray.find(
    (data) => data.eng === editWord.english
  );
  const tagsError = useSelector((state) => state.ui.error.tagsError);
  const defiError = useSelector((state) => state.ui.error.defiError);

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

    //字數限制
    if (editWord.definition.length >= 150) {
      dispatch(uiActions.showDefiError());
      setTimeout(() => {
        dispatch(uiActions.clearDefiError());
      }, 1500);
      return;
    }

    //處理重複標籤
    if (editWord.tags) {
      if (selectedObj.tags.includes(editWord.tags)) {
        dispatch(uiActions.showTagsError());
        setTimeout(() => {
          dispatch(uiActions.clearTagsError());
        }, 1000);
        return;
      }
    }

    dispatch(vocActions.storeEdit());
    dispatch(uiActions.resetCardMode());
    navigate(`/profile/${tags}`);
    alert("修改成功");

    // 當次修改沒改到tags
    if (!editWord.tags) {
      // 若是第一次新增tags
      if (selectedObj.tags.includes("__NoTag")) {
        finalEditWord = { ...editWord };
      } else {
        finalEditWord = { ...editWord, tags: selectedObj.tags };
      }
    } else if (selectedObj.tags.includes("__NoTag")) {
      //如果有新增tags且是第一次新增tags
      finalEditWord = { ...editWord, tags: [editWord.tags] };
      dispatch(
        vocActions.addTags({ eng: editWord.english, tagsInput: editWord.tags })
      );

      dispatch(vocActions.removeFromBox(id));
      navigate(`/profile`);
    } else {
      // 如果有新增tasg且不是第一次新增
      dispatch(
        vocActions.addTags({ eng: editWord.english, tagsInput: editWord.tags })
      );

      finalEditWord = {
        ...editWord,
        tags: [...selectedObj.tags, editWord.tags],
      };
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
          {defiError && <span>定義超過最大長度限制</span>}
          <Form.Control
            as="textarea"
            rows={3}
            maxLength={150}
            value={editWord.definition}
            onChange={(e) => {
              editHandler(e, "definition");
            }}
            style={{ outline: defiError ? "3px solid red" : null }}
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

        {tagsError && <p style={{ color: "red" }}>請勿輸入空白或重複標籤</p>}

        <div className={classes.btnContainer}>
          <Button variant="primary" type="submit" className={classes.Btn}>
            提交修改
          </Button>

          <Button onClick={goBack}>返回上一頁</Button>
        </div>

        {selectedObj.tags[0] !== "__NoTag" && (
          <div className={classes.tagsContainer}>
            <hr />
            <div className={classes.vocTags}>
              {selectedObj.tags.map((tagName, index) => (
                <span key={index}>{tagName}</span>
              ))}
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default Edit;
