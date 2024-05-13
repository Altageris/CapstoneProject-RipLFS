const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../modules/User");
const multer = require("multer");
// Set up Multer storage in memory
const storage = multer.memoryStorage();
// const FormData = require('form-data');
const { OpenAI } = require("openai");
const { Readable } = require("stream");

// Initialize Multer
const upload = multer({ storage: storage });
let users = [];
const delay = (ms) =>
  new Promise((res) =>
    setTimeout(res, ms)
  ); /* Delay use to ask server if it is player turn and update grid*/

async function registerV2Verify(username, gender) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://public.v2ondemandapis.com/1/sve/Enrollment/${username}/${gender}`,
    headers: {
      "Cloud-Developer-Key": "A9676558-C4A8-W647-ACC4-1DE3C5458344",
      "Cloud-Application-Key": "7BF2A8B0-79B7-W1CE-A4C3-203008641657",
      "Vv-Override-Token": "123456",
      "Interaction-Tag": username,
    },
  };

  return await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      console.log(JSON.stringify(response.headers));
      session_id = response.headers["vv-session-id"];
      const user = new User(username, session_id);
      users.push(user);
      return user;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function SendEnrollmentVoiceData(file, session_id) {
  let data = new FormData();
  const audioFile = await OpenAI.toFile(
    Readable.from(file.buffer),
    "audio.mp3",
    {
      type: "audio/mpeg",
    }
  );
  data.append("data", audioFile);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://public.v2ondemandapis.com/1/sve/Enrollment",
    headers: {
      "Vv-Session-Id": session_id,
      // ...data.getHeaders()
    },
    data: data,
  };

  await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
async function finalizeEnrollment(session_id) {
  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "https://public.v2ondemandapis.com/1/sve/Enrollment",
    headers: {
      "Vv-Session-Id": session_id,
    },
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
async function startVerification(username) {
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://public.v2ondemandapis.com/1/sve/Verification/${username}/`,
    headers: {
      "Vv-Override-Token": "123456",
      "Cloud-Application-Key": "7BF2A8B0-79B7-W1CE-A4C3-203008641657",
      "Cloud-Developer-Key": "A9676558-C4A8-W647-ACC4-1DE3C5458344",
    },
  };

  return await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      session_id = response.headers["vv-session-id"];
      return session_id;
    })
    .catch((error) => {
      console.log(error);
    });
}
async function sendVerificationVoiceData(file, session_id) {
  let data = new FormData();
  const audioFile = await OpenAI.toFile(
    Readable.from(file.buffer),
    "audio.mp3",
    {
      type: "audio/mpeg",
    }
  );
  data.append("data", audioFile);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://public.v2ondemandapis.com/1/sve/Verification",
    headers: {
      "Vv-Session-Id": session_id,
      // ...data.getHeaders()
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
async function finalizeVerification(session_id) {
  // let data = new FormData();

  let config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: "https://public.v2ondemandapis.com/1/sve/Verification?Vv-Session-Id=d69f9226-115a-4417-25f6-b30c217c61bd",
    headers: {
      "Vv-Session-Id": session_id,
    },
    // data : data
  };

  return await axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return response.data["result.verify"];
    })
    .catch((error) => {
      console.log(error);
    });
}
router.post(
  "/register",
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "No body submitted" });
    }
    const { username, gender } = req.body;
    let session_id = null;
    console.log(req.body);
    console.log(req.file);
    session_id = (await registerV2Verify(username, gender)).vv_session_id;
    console.log("Enrollment started");
    await SendEnrollmentVoiceData(req.file, session_id);
    console.log("Voice data collected");
    await finalizeEnrollment(session_id);
    console.log("User: " + username + " has been successfully enrolled");
  }
);
router.post(
  "/verification",
  upload.single("file"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!req.body) {
      return res.status(400).json({ message: "No body submitted" });
    }
    const { username, gender } = req.body;
    let session_id = null;
    console.log(req.body);
    console.log(req.file);
    session_id = await startVerification(username);

    console.log("Verification started");
    await sendVerificationVoiceData(req.file, session_id);
    
    console.log("Voice data collected");
    await delay(5000) /** Delay of 5 sec to ensure previous request processing is over */
    const result = await finalizeVerification(session_id);
    console.log(result);
    res.status(200).json(result);
    // console.log('User: ' + username + ' has been successfully enrolled')
  }
);

module.exports = router;
