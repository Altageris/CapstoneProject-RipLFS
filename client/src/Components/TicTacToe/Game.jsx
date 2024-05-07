import React, { useState, useRef, useEffect } from "react";
import "./TicTacToe.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";
import { useNavigate } from "react-router-dom";
import VoiceRecording from "../Auth/VoiceRecording";
import SubmitPlayButton from "../Miscellaneous/SubmitPlayButton";
import Lobby from "./Lobby";
import { TicTacToe } from "./TicTacToe";
export const Game = () => {
    const [roomID, setRoomID] = useState(null);
    const [steps, setSteps] = useState(0)
    function next () {
        console.log('Switching to tic tac toe')
        return setSteps(1)
    }
    return (
        <>
        {steps === 0 && <Lobby roomID={roomID} setRoomID={setRoomID} next={next}/>}
        {steps ===1 && <TicTacToe roomID={roomID}/>}
        {/* <button onClick={()=> {
            console.log(roomID)
        }}>DEBUGGING</button> */}
        </>
    )
};
