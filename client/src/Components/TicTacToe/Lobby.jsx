import { useState, useEffect } from "react";
import "./Lobby.css";
export const Lobby = ({roomID, setRoomID,username, setUsername, next}) => {
  const [players, setPlayers] = useState([
    // { name: "Tommy Galagher", status: "ready" },
    // { name: "Stefan Vilebrequin", status: "not ready" },
  ]);
  const [canStart, setCanStart] = useState(false)
  const [steps, setSteps] = useState(0);
  // const [username, setUsername] = useState('')
  const [intervalID, setIntervalID] = useState(null);
  const [message, setMessage] = useState('')
  useEffect(() => {
    console.log(roomID)
    if(roomID !== null && !canStart){

        setIntervalID(
            setInterval(async () => {
                await waitForPlayer();
            }, 2000)
        );
    }
    clearInterval(intervalID);
  }, [players, roomID]);
  // Function to join a game room
  async function waitForPlayer(){
    fetch(`${process.env.REACT_APP_SERVER_URL}/game/waitForPlayer/`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username:username})
    })
      .then((res) => res.json())
      .then(async (res) => {
        console.log(res);
        setPlayers(res.players)
        setCanStart(res.canStart)
        if(res.canStart){
            await allPlayersReady()
        }

      });
  }
  async function joinGame() {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/game/join`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username})
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        /* Sets room ID to the id of the room the server put you in. */
        setRoomID(res.roomID);
        setSteps(1)
      });
  }
  /* Runs after you joined a room. Sets the player status to ready. Once both players have set to ready, game will start. */
  async function startGame(e) {
    e.target.classList.add("ready-clicked");
    await fetch(`${process.env.REACT_APP_SERVER_URL}/game/ready`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: username})
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        // setRoomID(res.roomID)
      });
  }
  async function allPlayersReady(){
    /* Wait before changing the UI to start the game */
            console.log('Game should start soon')
            setMessage('All players are ready. Game will start soon')
            clearInterval(intervalID)
            await new Promise(resolve => setTimeout(resolve, 3000));
            next()
            return
        
  }
  return (<>
  
    <div className="containerLobby">
      <div className="interface">
        {steps === 0 &&<div>
          <h1>Tic Talk Toe</h1>
          <div>Enter your username and click find game</div>
          <div className="input-div">
            <label htmlFor="username">Username&nbsp; </label>
            <input id="username" value={username} onChange={(e)=> setUsername(e.target.value)} className="input"></input>
          </div>
          <button className="button" onClick={joinGame}>Find game</button>
          <button onClick={()=> {
            console.log(username)
        }}>DEBUGGING</button>
        </div>}

        {/* <div className="input-div">
          <label htmlFor="roomCode">Room code</label>
          <input id="roomCode" className="input"></input>
        </div> */}
        {steps ===1 &&<div className="lobby">
            <h1>Waiting for all players</h1>
          <div className="lobbyRow">
            <div className="flex1">Players</div>
            <div className="flex2">Status</div>
          </div>
          {players.map((player) => (
            <li className="lobbyRow">
              <div className="flex1">{player.username}</div>
              <div className="flex2">{player.status}</div>
            </li>
          ))}
        <button onClick={startGame}>Ready</button>
        <div >{message}</div>

        </div>}
      </div>
    </div>
    </>
  );
};
export default Lobby;
