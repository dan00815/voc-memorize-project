import React, { useRef } from "react";
import classes from "./Audio.module.scss";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../store/ui-slice";

const Audio = ({ word }) => {
  const dispatch = useDispatch();
  const audioRef = useRef();
  const audioError = useSelector((state) => state.ui.error.audioError);
  const audio = useSelector((state) => state.ui.audio);

  async function fetchAudioData() {
    try {
      const audioUrl = `https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=false&limit=1&api_key=${process.env.REACT_APP_WORDNIK_API}`;
      const fetchRes = await axios.get(audioUrl);
      const audioFile = fetchRes.data[0].fileUrl;

      audioRef.current.addEventListener("ended", () => {
        dispatch(uiActions.closeAudio());
      });

      dispatch(uiActions.openAudio());
      audioRef.current.src = audioFile;
      audioRef.current.play();
    } catch (error) {
      if (error.response.data.statusCode === 404) {
        dispatch(uiActions.showAudioError(error.response.data.message));
        setTimeout(() => {
          dispatch(uiActions.clearAudioError());
        }, 1000);
      } else {
        dispatch(uiActions.showAudioError("Too much click"));
        setTimeout(() => {
          dispatch(uiActions.clearAudioError());
        }, 1000);
      }
    }
  }

  return (
    <>
      <div className={classes.audio}>
        <FontAwesomeIcon
          icon={faVolumeHigh}
          onClick={fetchAudioData}
          className={audio ? classes["audio-effect"] : undefined}
        />
        <audio src="" ref={audioRef}></audio>
      </div>

      {audioError && <h3 className={classes.audioError}>{audioError}</h3>}
    </>
  );
};

export default Audio;
