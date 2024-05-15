import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const ProgressBar = ({ time }) => {
  const dispatch = useDispatch();
  const progressAmount = useSelector((state) => state.ui.progressBar);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progressAmount !== 0) {
        dispatch(uiActions.ProgressEvent());
      }
    }, 150);

    return () => {
      clearInterval(interval);
      dispatch(uiActions.recoverProgress());
    };
  }, []);

  return <progress value={progressAmount} max={time} />;
};

export default ProgressBar;
