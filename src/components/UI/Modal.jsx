import React, { forwardRef } from "react";
import { createPortal } from "react-dom";

const Modal = forwardRef(({ vocData, definition, sentence }, ref) => {
  function closeModalHandler() {
    ref.current.close();
  }

  return createPortal(
    <dialog ref={ref} className="dialog">
      <h1>
        {vocData.eng} {vocData.chi}
      </h1>
      <p>定義 : {definition}</p>
      <p>例句: {sentence}</p>
      <div className="actions">
        <button>收藏按鈕</button>
        <button onClick={closeModalHandler}>關閉</button>
      </div>
    </dialog>,
    document.querySelector("#modal")
  );
});

export default Modal;
