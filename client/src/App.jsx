import React, { useState } from 'react';
import './App.css'; /* Import CSS styles for the App component */
import Home from './Components/Home/Home.jsx'; /* Import the Home component */
import { TicTacToe } from './Components/TicTacToe/TicTacToe.jsx'; /* Import the TicTacToe component */
import Login from './Components/Auth/Login.jsx'; /* Import the Login component */
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; /* More info available at https://reactrouter.com/en/main/router-components/browser-router  */
import SignUp from './Components/Auth/SignUp.jsx';
import VoiceRecording from './Components/Auth/VoiceRecording.jsx';
import SubmitPlayButton from './Components/Miscellaneous/SubmitPlayButton.jsx';
import { Game } from './Components/TicTacToe/Game.jsx';

function App({onBack}) {

  // /* Define state to track the current selected game */
  // const [currentGame, setCurrentGame] = useState(null); /* null when no game is selected */

  // /* Function to set the current game based on the game selected */
  // const playGame = (gameName) => { 
  //   setCurrentGame(gameName); /* Set the current game based on the game selected */
  // };

  // /* Function to switch back to Home component */
  // const backToHome = () => {
  //   setCurrentGame(null); /* Set currentGame to null to switch back to Home component */
  // };

  // /* Function to render the appropriate game component based on currentGame */
  // const renderGame = () => {
  //   switch (currentGame) {
  //     case 'Tic Talk Toe':
  //       return <TicTacToe onBack={backToHome}/>; /* Render TicTacToe component if selected */
  //     /* Add cases for other games here */
  //     default:
  //       return <Home onPlay={playGame}/>; /* Render Home component by default */
  //   }
  // };

  return (
    // <div className="App"> {/* Main container for the application */}
    //   {/* Render either the selected game or the Home component based on currentGame */}
    //   {currentGame ? renderGame() : <Home onPlay={playGame} />} 
    // </div>
    <BrowserRouter basename="">
      <Routes>
        <Route element={<Home/>} path="/" />
        <Route element={<Login/>} path="/login" />
        <Route element={<SignUp/>} path="/signup" />
        <Route element= {<Game/>} path='/Tic-Talk-Toe'/>
        <Route element= {<VoiceRecording/>} path='/VoiceRecording'/>
        <Route element= {<SubmitPlayButton/>} path='/SubmitPlay'/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
