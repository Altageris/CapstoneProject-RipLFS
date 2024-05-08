import { useState } from "react";
import "./Button.css";
const SubmitPlayButton = ({onSubmit, status}) => {
    // const [playerTurn, setPlayerTurn] = useState(true)
  const onClick = (e) => {
    // if(!playerTurn){
    //     return
    // }
    console.log('Clicked')
    onSubmit()
    let self = e.target;
    // setPlayerTurn(!playerTurn)
    setTimeout(function () {
      self.className = "loading";
    }, 125);
    // if(status === 'valid'){
    //   self.className = "valid"
    // } else if (status === 'invalid'){
    //   self.className = 'invalid'
    // }
    setTimeout(function () {
      self.className = "ready";
    }, 4300);
  };

  return (
    <div>
      <button className={status} onClick={onClick}>Send</button>
    </div>
  );
};
export default SubmitPlayButton;
