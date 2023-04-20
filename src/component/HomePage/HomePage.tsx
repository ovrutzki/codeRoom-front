import React from "react";
import "./HomePage.css";
import data from '../../rooms.json'
import { useNavigate } from "react-router-dom";
import GeneralButton from "../GeneralButton/GeneralButton";
import { IRoom } from "../../store/interface";


const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const allRooms:IRoom[] = data
  return (
    <div id="container">
      <div id="titles-div">
        <h1>Welcome to CodeRoom</h1>
        <h2>your home for learn code</h2>
      </div>
        <h2>chose a room and get started</h2>
      <div id="rooms-div">
        {allRooms.map((room:IRoom,index:number) => 
        <div key={index} className="room-box" onClick={() =>navigate(`room/${room.roomName}`)}>{room.roomName}</div>
        )}
      </div>
      </div>
  );
};

export default HomePage;
