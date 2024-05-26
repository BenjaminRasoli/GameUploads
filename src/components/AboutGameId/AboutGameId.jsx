import React from "react";
import { Link } from "react-router-dom";
import Login from "../../assets/ItchIoLogin.png";
import Upload from "../../assets/ItchIoUpload.png";
import Edit from "../../assets/EditGame.png";
import GameId from "../../assets/GameId.png";
import Public from "../../assets/MakePublic.png";
import Setting from "../../assets/Setting.png";
import Setting2 from "../../assets/Setting2.png";

function AboutGameId() {
  return (
    <div className=" container flex justify-center items-center flex-col mx-auto px-4 py-8 text-cyan-600">
      <h1 className="text-5xl font-bold mb-4">How to Get the Game ID</h1>
      <ol className="list-decimal pl-4 text-4xl">
        <li className="mb-4">
          <p className="text-3xl">
            Go to
            <a
              className="text-yellow-600"
              href="https://itch.io/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <b> itch.io </b>
            </a>
            and create an account.
          </p>
          <img src={Login} alt="" className="w-1/2 h-96 m-5" />
        </li>
        <li className="mb-4">
          <p className="text-3xl">Upload your game.</p>
          <img src={Upload} alt="" className="w-1/2 h-96 m-5" />
        </li>
        <li className="mb-4">
          <p className="text-3xl">
            Pick these settings when uploading you're game.
          </p>
          <img src={Setting2} alt="" className="w-1/2 h-96 m-5" />
          <img src={Setting} alt="" className="w-1/2 h-96 m-5" />
          <img src={Public} alt="" className="w-1/2 h-96 m-5" />
          <p className="text-cyan-300 text-lg italic">
            (You might have to upload the game and then edit it to make it
            public)
          </p>
        </li>
        <li className="mb-4">
          <p className="text-3xl">
            Edit the game go to "Distribute" and then "Embed Game" in the box
            with the text there will be numbers after "embed-upload" that is the game
            id.
          </p>
          <img src={Edit} alt="" className="w-1/2 h-96 m-5" />
          <img src={GameId} alt="" className="w-1/2 h-96 m-5" />
        </li>
        <li>
          <Link to={"/upload"}>
            <p className="text-3xl text-cyan-300">Back to upload.</p>
          </Link>
        </li>
      </ol>
    </div>
  );
}

export default AboutGameId;
