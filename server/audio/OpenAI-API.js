const { OpenAI } = require("openai");
require('dotenv').config()
const axios = require('axios');
const {Readable } = require('stream')
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeText(audioFileUrl, audio ){
  console.log("Trying to transcribe the text")
  console.log(audioFileUrl)

  try {

    const audioFile = await OpenAI.toFile(Readable.from(audio.buffer), 'audio.mp3', {
      type: "audio/mpeg",
    });
    
    console.log(audioFile)
    console.log(audioFile.name)

    const result = await client.audio.transcriptions.create({
    model: "whisper-1",
    file: audioFile
    }).then(response => {
    console.log('Transcription: ' + response.text)
    return response.text
  }).catch(error => {
    console.error("Failed to transcribe audio:", error);
  });
 return result
} catch(error){
  return ""
}
 
}
module.exports = transcribeText