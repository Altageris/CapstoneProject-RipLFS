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
const convertTextToMove = require("../modules/AudioTranscription");
const axios = require('axios');
const {rooms} = require("../routes/gameRouter")
const transcribeText = require('../audio/OpenAI-API')
/** TO DO: Return transcribed speech back to user saying: "Error couldn't find {transcribed text}. To speak in grid terms what column does that refer to? 
 * That information will be used to expand the list of words we are catching to represent commands'". 
 * If instead it is trancribed well and could find a cell, it should print to user, you wish to place on C1, correct? Then a button where you can confirm, or audio confirm */
router.post(
  "/move",
  upload.single("file"),
  async function (req, res,  next) {
    console.log(rooms)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "No body submitted" });
    }
    console.log(`Post /audio/move `);
    const transcribedText =await transcribeText(req.body.voiceUrl, req.file)
    // HERE
    const move = await convertTextToMove(transcribedText)
    console.log('Move is: ' + move)
    if (move === null) {
      console.log("Could not detect valid moves, try again");
      res
        .status(201)
        .json({
          message: "Could not detect valid moves, try again",
          transcription: transcribedText,
          playerTurn: true,
        });
      return;
    }
    return processMove(move, rooms, req, res);
  }
);
module.exports = router;
