import React, { useState, useRef, useEffect } from "react";
import "./TicTacToe.css";
import circle_icon from "../Assets/circle.png";
import cross_icon from "../Assets/cross.png";
import { useNavigate } from "react-router-dom";
import VoiceRecording from "../Auth/VoiceRecording";
import SubmitPlayButton from "../Miscellaneous/SubmitPlayButton";
import Lobby from "./Lobby";
export const TicTacToe = (roomID) => {
  // const delay = ms => new Promise(res => setTimeout(res, ms)); /* Delay use to ask server if it is player turn and update grid*/
  // const [roomID, setRoomID] = useState(null);
  const [gameMessage, setGameMessage] = useState("");
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [showHome, setShowHome] = useState(false);
  const navigate = useNavigate();
  const [userAudioAsBlob, setUserAudioAsBlob] = useState(null);
  const [status, setStatus] = useState(null);
  const [transcription, setTranscription] = useState("");
  const intervalRef = useRef(null); // Ref to hold the interval ID
  const onPlay = () => {
    setShowHome(true);
  };
  const [intervalID, setIntervalID] = useState(null);
  const [rematchIntervalID, setRematchIntervalID] = useState(null);
  // let intervalID = null
  const [grid, setGrid] = useState([
    ["", "", ""] /*A0 A1 A2 */,
    ["", "", ""] /*B0 B1 B2 */,
    ["", "", ""] /*C0 C1 C2*/,
  ]);
  const [winner, setWinner] = useState("");
  const [playerTurn, setPlayerTurn] =
    useState(false); /* Player 1 defaults to false*/
  /* Runs the waitForYourTurn Function every 5 sec. */
  // let intervalID = setInterval(winner === '' ? waitForYourTurn : null, 5000)
  const [rematchRequested, setRematchRequested] = useState(false);
  const [callWaitTurn, setCallWaitTurn] = useState(true)
  useEffect(() => {
    if (callWaitTurn) {
      setIntervalID(
        // intervalID =
        setInterval(async () => {
          await waitForYourTurn();
        }, 2000)
      );
      console.log("Creating new IntervalID: " + intervalID);
    }

    console.log("Clearing interval ID: " + intervalID);
    clearInterval(intervalID);
  }, [callWaitTurn]);

  useEffect(()=> {
    if(rematchRequested){
      setRematchIntervalID(
        // intervalID =
        setInterval(async () => {
          await handleRematchRequest();
        }, 2000)
      );
  }
  clearInterval(rematchIntervalID);
    
  }, [rematchRequested])
  useEffect(() => {
    // console.log(grid)
    // console.log(winner)
    if (winner === "X") {
      titleRef.current.innerHTML = "Winner:   <img src=" + cross_icon + ">";
    } else if (winner === "O") {
      titleRef.current.innerHTML = "Winner:   <img src=" + circle_icon + ">";
    }
    setPlayerTurn(false);
  }, [winner]);
  let titleRef = useRef(null);

  // Function to join a game room
  async function joinGame() {
    await fetch("http://localhost:3001/game/join", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        /* Sets room ID to the id of the room the server put you in. */
        // setRoomID(res.roomID);
      });
  }
  async function moveAudio() {
    setError("");
    if (
      userAudioAsBlob === null
      //|| !playerTurn
    ) {
      console.log("no audio");
      return;
    }
    console.log(userAudioAsBlob);
    let formData = new FormData();
    let file = new File([userAudioAsBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
    console.log(file);
    formData.append("file", file);
    formData.append("voiceUrl", URL.createObjectURL(userAudioAsBlob));
    console.log("Sending audio to server");
    fetch("http://localhost:3001/audio/move", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        if (res.isAccepted) {
          console.log("Move accepted , should update grid");
          console.log(res.grid);
          setPlayerTurn(false);
          setTranscription(res.transcription);
          setGrid(res.grid);
          if (res.winner !== "") {
            setWinner(res.winner);
          }

          // waitForYourTurn();
        } else {
          console.log(res);
          setTranscription(res.transcription);
          setError(res.message);
        }
      });
  }

  /* Runs after you joined a room. Sets the player status to ready. Once both players have set to ready, game will start. */
  async function startGame(e) {
    e.target.classList.add("ready-clicked");
    setIsReady(true);
    await fetch("http://localhost:3001/game/ready", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // setRoomID(res.roomID)
      });
  }

  useEffect(() => {
    return () => {
      if (intervalID) {
        clearInterval(intervalID);
      }
    };
  }, [intervalID]);

  /* TO DO: Currently resets all rooms to null. Does not work properly and should only reset the current room to play again. */
  function reset() {
    // Reset all states and call the reset endpoint
    // setRoomID(null);
    setGameMessage("");
    setIsReady(false);
    setGrid([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setWinner("");
    setPlayerTurn(false);
    titleRef.current.innerHTML = "Tic Talk Toe";

    fetch("http://localhost:3001/game/reset/", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
    });
  }

  const handleRematchRequest = async () => {
    // API call to server to request rematch
    const response = await fetch("http://localhost:3001/game/rematch/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res)=> res.json()).then(res => {
      /* This will start handleRematchRequest calls */
      setRematchRequested(true);
      setGameMessage(res.message);
      /* This will restart waitTurn calls */
    if(res.rematch){
      setWinner(res.winner)
      setGrid(res.grid)
      setRematchRequested(false)
      setCallWaitTurn(true)
    }
    });
    // const data = await response.json();

    // if (data.message === "Rematch started") {
    //   // Rematch is agreed by both players, reset the board
    //   resetBoard();
    // } else {
    //   // Waiting for the other player to agree to rematch
    //   setGameMessage(data.message);
    // }
  };

  const resetBoard = () => {
    // Reset the board for a new game
    setGrid([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setWinner("");
    setPlayerTurn(false); // or true, depending on who should start the new game
    setGameMessage("");
    setRematchRequested(false); // Reset rematch state
  };

  // Function that runs on defined time interval to retrieve data changes from server, and decide whose turn it is
  async function waitForYourTurn() {
    if(winner !== ""){
      setCallWaitTurn(false);
      return
    }
    fetch("http://localhost:3001/game/waitTurn/", {
      method: "GET", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
        setGameMessage(res.message);
        setCallWaitTurn(true)
        // setPlayerTurn(res.wait)
        if (res.grid) {
          setGrid(res.grid);
        }
        if (res.playerTurn) {
          console.log("It is your turn, grid should update");

          setPlayerTurn(res.playerTurn);
        }
        if (res.winner) {
          setWinner(res.winner);
         setCallWaitTurn(false)
        }
      });
  }

  // Function to handle cell click in the grid
  const gridCellToggle = async (e, row, col) => {
    /* Do nothing if it is not your turn */
    if (!playerTurn) return;
    /* Sets move to grid value */
    const move = e.target.getAttribute("value");
    /* Call to server to handle move */
    fetch("http://localhost:3001/game/move/", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // mode: "cors", // no-cors, *cors, same-origin
      // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ move: move, roomID: roomID, type: "click" }),
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.isAccepted) {
          console.log("Move accepted , should update grid");
          console.log(res.grid);
          setPlayerTurn(false);
          setGrid(res.grid);
          if (res.winner !== "") {
            setWinner(res.winner);
          }
          // waitForYourTurn();
        }
      });
  };

  // Function to handle back button click
  const handleBack = () => {
    reset(); // Reset the game
    navigate("/");
  };



  /* TO DO: 
    Provide user feedback on what is going on. Currently only displays a message and requires user to go through the steps in order: Join game, then set ready.
    Need to separate in another page forcing the user to join a game first, then directing here to the lobby. */

  return (
    <div className="container">
      <button className="back-button" onClick={handleBack}>
        &lt;
      </button>
      <h1 className="title" ref={titleRef}>
        Tic Talk Toe
      </h1>
      <div className="">
        <div className="board">
          <div className="row boxHeadersTopMargin">
            <div className="boxHeaderTop">0</div>
            <div className="boxHeaderTop">1</div>
            <div className="boxHeaderTop">2</div>
          </div>
          <div className="row ">
            <div className="col boxHeadersLeftMargin">
              <div className="boxHeaderLeft">A</div>
              <div className="boxHeaderLeft">B</div>
              <div className="boxHeaderLeft">C</div>
            </div>
            <div className="flex-wrap">
              {grid.map((row, rowIndex) => {
                // console.log(row)
                let cellDivArr = grid[rowIndex].map((cell, columnIndex) => {
                  let id = `box${rowIndex}${columnIndex}`;
                  let rowValue;
                  switch (rowIndex) {
                    case 0:
                      rowValue = "A";
                      break;

                    case 1:
                      rowValue = "B";
                      break;
                    case 2:
                      rowValue = "C";
                      break;
                    default:
                  }
                  let cellValue;
                  let cellIcon = "";
                  if (grid[rowIndex][columnIndex] !== "") {
                    if (grid[rowIndex][columnIndex] === "X") {
                      cellIcon = <img alt="X" src={cross_icon} />;
                    } else {
                      cellIcon = <img alt="X" src={circle_icon} />;
                    }
                  }
                  const colValue = columnIndex % 3;

                  cellValue = `${rowValue}${colValue}`;
                  // console.log(cellValue)
                  return (
                    <div
                      className="boxes"
                      id={id}
                      value={cellValue}
                      key={cellValue}
                      onClick={(e) => {
                        gridCellToggle(e, rowIndex, columnIndex);
                      }}
                    >
                      {cellIcon}
                    </div>
                  );
                });

                return (
                  <div className="row" key={rowIndex}>
                    {cellDivArr}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <VoiceRecording setAudio={setUserAudioAsBlob} />
        <div>{transcription}</div>
        <div>{error}</div>
      </div>
      <div className="gameMessage">{gameMessage}</div>

      {/* <button className="game-button" onClick={reset}>
        Reset
      </button>
      <button className="game-button" onClick={joinGame}>
        Join Game
      </button> */}
      {/* /* <button className="game-button" onClick={startGame}>
        Ready
      </button> */}

      {winner && !rematchRequested && (
        <div>
          <button className="game-button" onClick={handleRematchRequest}>
            Rematch?
          </button>
        </div>
      )}

      {/* {rematchRequested && (
        <div className="gameMessage">
          Waiting for the other player to accept the rematch...
        </div>
      )} */}
      <button onClick={moveAudio}>Send</button>
    </div>
  );
};
