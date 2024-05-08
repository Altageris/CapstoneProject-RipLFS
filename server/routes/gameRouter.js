const express = require("express");
const routerFunction = require("../modules/gameRouterFunctions");
const Game = require("../modules/Game");
const Room = require("../modules/Room");
const uuid = require("uuid");
let { createTopic, produceMessage, consumeMessages } = require('../kafka/kafkaService');
/** Turn this value to true to enable kafka commands */
const enableKafka = false
const router = express.Router();


let globalRoomId = null;
let rooms = []; /* Stores Room objects*/
/* Finds the next available room by finding the first non full room */

/* NOTHING HERE. May Change*/
router.get("/", async function (req, res, next) {});

/* Post Route /move used to process client move
   Requires the player to already be in a room
   Requires move sent through Post body */
router.post("/move", async function (req, res, next) {
  if(routerFunction.move(req, res, rooms) === true){
    if(enableKafka){
      produceMessage(globalRoomId, 'key1', "Player " + req.headers.origin + " selected " + req.body.move)
    } 
  }
});

/* reset Every room. TO DO: Only reset current game. */
router.get("/reset", function (req, res, next) {
  console.log("GET /reset");
  
  if(enableKafka){
    produceMessage(globalRoomId, 'key1', "Game Reset")

  }
  rooms = [];
  routerFunction.reset(req,res,rooms)
});

/* Route for client to join a room. Required before starting a game. */
router.get("/join", async function (req, res, next) {
  routerFunction.join(req, res, rooms);
});
router.post("/join", async function (req, res, next) {
  routerFunction.join(req, res, rooms);
});
router.get("/waitForPlayer", async function (req, res, next) {
  console.log("GET /waitForPlayer")
  routerFunction.waitForPlayer(req, res, rooms)

});
/* Route for client to set his status as ready. Once the two players are marked as ready, the game is created and can be played */
router.get("/ready", async function (req, res, next) {
  const readyStatus = routerFunction.ready(req, res, rooms);
  let newGame = !(readyStatus === undefined)
  if (newGame && enableKafka) {
    globalRoomId = readyStatus
    await createTopic(globalRoomId)
    consumeMessages(globalRoomId)
    produceMessage(globalRoomId, 'key1', "Game Started")
  }
});
/* Main route to update clients every time interval defined in the client source file.
   The idea is that every T time, client makes a call to this route in order to retrieve the current state of the game. 
   This route is also used after a user makes a move, in order to wait for his turn.
   The player turn is determined based on the index of the player inside the room. */
router.get("/waitTurn", async function (req, res, next) {
  console.log("GET /waitTurn")
  potentialWinner = routerFunction.waitTurn(req, res, rooms)

  if(potentialWinner !== undefined && enableKafka) {
    produceMessage(globalRoomId, 'key1', "Player " + potentialWinner + " Wins!")
  }
});

/* To do: Disconnect user after idle time so we can delete rooms.*/
/* To do: Delete everyroom that have 0 players every 1 hour *
/* To do: ask for a rematch? Need specific route listening for that request, so that we can update states in client and restart the waitTurn calls.*/
/* Testing route to get real time information about the variable Rooms */
router.get('/rooms', async function(req,res,next){
  res.json(rooms)
})
const gameRouter=router
module.exports = {gameRouter, rooms};
