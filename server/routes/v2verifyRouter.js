const express = require("express");
const router = express.Router();
const axios = require('axios');
const User = require('../modules/User')
const multer = require('multer');
// Set up Multer storage in memory
const storage = multer.memoryStorage();
// const FormData = require('form-data');

// Initialize Multer
const upload = multer({ storage: storage });
let users = []

async function registerV2Verify (username, gender) {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://public.v2ondemandapis.com/1/sve/Enrollment/${username}/${gender}`,
    headers: { 
      'Cloud-Developer-Key': 'A9676558-C4A8-W647-ACC4-1DE3C5458344', 
      'Cloud-Application-Key': '7BF2A8B0-79B7-W1CE-A4C3-203008641657', 
      'Vv-Override-Token': '123456', 
      'Interaction-Tag': username
    }
  };
  
  await axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    console.log(JSON.stringify(response.headers));
    session_id = response.headers['vv-session-id']
    const user = new User(username, session_id)
    users.push(user)
  })
  .catch((error) => {
    console.log(error);
  });
}
function SendEnrollmentVoiceData (file, session_id) {
  let data = new FormData()
  data.append('data',file)
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://public.v2ondemandapis.com/1/sve/Enrollment',
    headers: { 
      'Vv-Session-Id': session_id, 
      // ...data.getHeaders()
    },
    data : data
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    // console.log(error);
  });
}

router.post('/register',upload.single('file'), async function (req,res,next) {
  if(!req.file){
    return res.status(400).json({ message: 'No file uploaded' });
  }
if(!req.body){
  return res.status(400).json({ message: 'No body submitted' });

}
  const {username, gender} = req.body
  let session_id = null
    console.log(req.body)
    console.log(req.file)
    // await registerV2Verify(username, gender)
    // await SendEnrollmentVoiceData(req.file, session_id)
})

module.exports = router