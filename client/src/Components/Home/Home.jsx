import React from 'react';
import './Home.css'; // Make sure to link the CSS file
import tictacphoto from '../Assets/tictactoe_photo.png';
import logo from '../Assets/northrop-grumman-logo.png'
import { useNavigate } from 'react-router-dom';

// Game Data
const games = [
    {
        name: 'Tic-Talk-Toe',
        imgSrc: tictacphoto, // Replace with actual image path
        playAction: () => console.log('Play TicTalk Toe') // Placeholder action
    },
    // {
    //     name: 'Game 2',
    //     imgSrc: '/path/to/game2/image', // Replace with actual image path
    //     playAction: () => console.log('Play Game 2') // Placeholder action
    // },
];


const Home = () => {
    const navigate = useNavigate()
    function onPlay (name) {
        navigate('/' + name)
    }
    return (
        <div className="home-container">
            <header className="home-header">
                <div className='home-content'>
                    <img className='logo' alt='NG Logo' src={logo} />
                    <h1>Tic Talk Toe</h1>
                    <nav className="header-nav">
                        <div className="dropdown">
                            <button className="dropbtn">About</button>
                            <div className="dropdown-content">
                                <a href="https://capstoneuno.s3.us-east-2.amazonaws.com/Capstone+Contents/Capstone+website+stuff/index.html">Meet the Team</a>
                                <a href="https://www.google.com/">How it Works</a>
                                <a href="https://www.google.com/">Contact Us</a>
                            </div>
                        </div>
                        <button className="sign-up-btn" onClick={()=> navigate('/signup')}>Sign Up</button>
                        <button className="sign-in-btn" onClick={()=> navigate('/login')}>Sign In</button>
                    </nav>
                </div>
            </header>
            <div className="game-grid">
                {games.map((game, index) => (
                    <div key={index} className="game-card">
                        <h3>{game.name}</h3>
                        <img src={game.imgSrc} alt={game.name} className="game-image" />
                        <button className="play-button" onClick={() => onPlay(game.name)}>Play Game</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
