/** This file contains all the logic to transcribe text into acceptable values for playing the Tic Talk Toe game */
const transcribeText = require('../audio/OpenAI-API')

const audioConversionValues = {
  A0: ["top left", "upper left", "A0", "A-0", "up left"],
  A1: ["top", "upper middle", "A1", "A-1", "up", "center", "top center"],
  A2: ["top right", "upper right", "A2", "A-2", "up right"],
  B0: ["left", "center left", "B0","B-0", "Be Zero.", "middle left"],
  B1: ["center", "middle", "B1","B-1", "Be One.", "Be One", "Bee One", "Bee One."],
  B2: ["right", "center right", "B2","B-2", "Be Two.", "middle right"],
  C0: ["bottom left", "lower left", "C0","C-0", 'See Zero.', "down left"],
  C1: ["bottom", "lower middle", "C1", "C-1", 'See One.',"low center", "down middle"],
  C2: ["bottom right", "lower right", "C2","C-2", 'See Two.', "down right"],
};
async function convertTextToMove (transcribedText) {
    // let transcribedText = ""
    // transcribedText = await transcribeText(audioUrl, audio)
    // console.log(transcribedText)
    let matchedKey = null
    /** Find any of the audioConversionValues listed above */
    Object.keys(audioConversionValues).forEach((key) => {
      const rowValues = audioConversionValues[key]
      let wordMatched = ""
      let numMatches = 0
      if(transcribedText === undefined){
        return null
      }
      rowValues.forEach((value)=> {
        if(transcribedText.toLowerCase().includes(value.toLowerCase())){
          wordMatched = value;
          numMatches ++;
        }
      })
      /* A matching word was found, return the key. So if user says Lower middle, then the returned value would be C1*/
      if(numMatches > 0 ){
        matchedKey = wordMatched
      }
    })
    return matchedKey
}
module.exports = convertTextToMove
