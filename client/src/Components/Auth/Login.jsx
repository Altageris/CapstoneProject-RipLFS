import "./Login.css";
import userIcon from "../Assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import VoiceRecording from "./VoiceRecording";

const Login = () => {
  const [userAudioAsBlob, setUserAudioAsBlob] = useState(null);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  function sendVoice(data, username, gender) {
    let formData = new FormData();
    let file = new File([data], "audio.mp3");
    console.log(file);
    formData.append("file", file);
    formData.append("username", username);
    formData.append("gender", gender);
    fetch(`${process.env.REACT_APP_SERVER_URL}/voice/verification`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // headers: {
      //   "Content-Type": `multipart/form-data`,
      // },

      body: formData,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }
  async function formSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const username = data.get("username");
    if (userAudioAsBlob === null) {
      setMessage("No voice data sent");
      return;
    }
    sendVoice(userAudioAsBlob, username, "M");
  }
  return (
    <div className="wrapper fadeInDown">
      <div id="formContent">
        {/* <!-- Tabs Titles --> */}
        <h2 className="active"> Sign In </h2>
        <h2
          className="inactive underlineHover"
          onClick={() => navigate("/signup")}
        >
          Sign Up{" "}
        </h2>

        {/* <!-- Icon --> */}
        <div className="fadeIn first">
          <img src={userIcon} id="icon" alt="User Icon" className="userIcon" />
        </div>

        {/* <!-- Login Form --> */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(e);
            formSubmit(e);
          }}
        >
          <input
            type="text"
            id="username"
            className="fadeIn second"
            name="username"
            placeholder="username"
          />
          {/* <input type="text" id="password" className="fadeIn third" name="login" placeholder="password"/> */}
          <VoiceRecording setAudio={setUserAudioAsBlob} />
          <div className="error">{message}</div>
          <input type="submit" className="fadeIn fourth" value="Log In" />
        </form>

        {/* <!-- Remind Passowrd --> */}
        <div id="formFooter">
          <a className="underlineHover" href="#">
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
