/** Since the middleware and routes format used for audio file transfer are not needed elsewhere,
 *  this file is made to clearly differentiate all voice requests */
const express = require("express");
const router = express.Router();
const multer = require("multer");
// Set up Multer storage in memory
const storage = multer.memoryStorage();
// const FormData = require('form-data');
const {findPlayerRoom, processMove} = require("../modules/gameRouterFunctions");
// Initialize Multer
const upload = multer({ storage: storage });
const convertAudioToMove = require("../modules/AudioTranscription");
const axios = require('axios');
const {rooms} = require("../routes/gameRouter")
const transcribeText = require('../audio/OpenAI-API')
/** TO DO: Return transcribed speech back to user saying: "Error couldn't find {transcribed text}. To speak in grid terms what column does that refer to? 
 * That information will be used to expand the list of words we are catching to represent commands'". 
 * If instead it is trancribed well and could find a cell, it should print to user, you wish to place on C1, correct? Then a button where you can confirm, or audio confirm */
router.post(
  "/move",
  upload.single("file"),
  async function (req, res, next) {
    console.log(rooms)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "No body submitted" });
    }
    console.log(`Post /audio/move `);
    console.log(req.body)
    // const response = await axios.get(req.body.voiceUrl, { responseType: 'arraybuffer' });
    // const voiceData = response.data;
	// const voiceReadable = new Readable();
	// voiceReadable.push(voiceData);
	// voiceReadable.push(null);
    // console.log(req.file)
    // let room = findPlayerRoom(req.headers.origin, rooms);
    // /** Possible values 'click', 'audio' */
    // /* Checks if client is inside a room */
    // if (room === undefined) {
    //   console.log("Player not in a room");
    //   res.status("200").json({ message: "Player not in in a room" });
    //   return;
    // }
    // let game = room.game;
    // if (Object.keys(req.body).length === 0) {
    //   res.status(207).json({ message: "Error, body is empty" });
    //   return;
    // }
    // console.log(req.file.constructor.name)
    const transcribedText =await transcribeText(audioUrl, audio)
    const move = await convertAudioToMove(req.body.voiceUrl, req.file)
    if (move === null) {
      console.log("Could not detect valid moves, try again");
      res
        .status(201)
        .json({
          message: "Could not detect valid moves, try again",
          playerTurn: true,
        });
      return;
    }
    return processMove(move, rooms, req, res);
  }
);
module.exports = router;