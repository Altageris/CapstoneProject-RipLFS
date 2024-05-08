import "./Login.css";
import userIcon from "../Assets/userIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import recordingIcon from "../Assets/recording.png";
import stopRecordingIcon from "../Assets/stopRecording.png";
import VoiceRecording from "./VoiceRecording";
const SignUp = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(0);
  const [userAudioAsBlob, setUserAudioAsBlob] = useState(null);
  const [message, setMessage] = useState("");
  function sendVoice(data, username, gender) {
    let formData = new FormData();
    let file = new File([data.blob], "audio.mp3");
    console.log(file);
    formData.append("file", file);
    formData.append("username", username);
    formData.append("gender", gender);
    fetch("http://localhost:3001/voice/register", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      // headers: {
      //   "Content-Type": `multipart/form-data`,
      // },

      body: formData,
    });
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
      {steps === 0 && (
        <div id="formContent">
          {/* <!-- Tabs Titles --> */}
          <h2 className="inactive" onClick={() => navigate("/login")}>
            {" "}
            Sign In{" "}
          </h2>
          <h2 className="active underlineHover">Sign Up </h2>

          {/* <!-- Icon --> */}
          <div className="fadeIn first">
            <img
              src={userIcon}
              id="icon"
              alt="User Icon"
              className="userIcon"
            />
          </div>

          {/* <!-- Login Form --> */}
          <h2>Welcome!! Let's get you started </h2>
          <div>
            {" "}
            First we are gonna need some sample of your voice. Whenever you are
            ready, click on the recording button and read the short story below
            from top to bottom
          </div>
          <div className="short-story-wrapper">
            <div className="short-story-text">
              Title: The Forgotten Note In the quaint town of Willow Creek,
              there was a hidden treasure, the old Willow Inn. Its walls echoed
              with the laughter of bygone days. One stormy evening, young Lily
              stumbled upon the inn while seeking shelter. Inside, she
              discovered a dusty piano. Curious, she brushed off the keys and
              played a haunting melody. Suddenly, a hidden compartment revealed
              an old, yellowed note. It spoke of lost love and shattered dreams.
              As Lily read, she felt a pang of empathy for the writer's sorrow.
              Determined to bring closure, she set out to find the author.
              Through winding alleys and forgotten memories, Lily uncovered the
              writer's identity – an elderly man named Henry. Tears welled in
              his eyes as Lily handed him the note. It was a love letter he had
              written decades ago but never sent. With trembling hands, Henry
              read his own words, and in that moment, he found peace. As the
              storm cleared, Lily left the inn, leaving behind a legacy of
              healing and forgiveness.
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e);
              formSubmit(e);
            }}
          >
            <input
              type="text"
              id="login"
              className="fadeIn second"
              name="username"
              placeholder="username"
            />
            <VoiceRecording setAudio={setUserAudioAsBlob} />
            <input type="submit" className="fadeIn fourth" value="Sign Up" />
            <div className="error">{message}</div>
          </form>
          <button
            onClick={() => {
              // console.log(audioRecorder.mediaRecorder);
            }}
          >
            DEBUGGING
          </button>

          {/* <!-- Remind Passowrd --> */}
          <div id="formFooter">
            <a className="underlineHover" href="google.com">
              Forgot Password?
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
export default SignUp;
