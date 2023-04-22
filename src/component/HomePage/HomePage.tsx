import React, { useEffect, useState } from "react";
import "./HomePage.css";
import data from '../../rooms.json'
import { useNavigate } from "react-router-dom";
import GeneralButton from "../GeneralButton/GeneralButton";
import { IRoom } from "../../store/interface";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllRooms } from "../../store/slicer/room.slicer";
import { IRootState } from "../../store/store";
import axios from "axios";
import Header from "../Header/Header";


const HomePage: React.FC = () => {
  const dispatch = useDispatch<any>()
  const navigate = useNavigate()
  const [loading,setLoading] = useState<boolean>(false)
  const [allRooms,setAllRoom] = useState<IRoom[]>([])
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get('http://localhost:8000/api/room');
      setAllRoom(response.data)
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }
  }
   useEffect(()=>{
     fetchData()
   },[])
  return (<>
      <Header />
    <div id="container">
      {loading && <div className="loader"></div> }
      <div id="titles-div">
        <h1>Welcome to CodeRoom</h1>
        <h2>your home for learn code</h2>
      </div>
        <h2>chose a room and get started</h2>
      <div id="rooms-div">
        {allRooms.map((room:IRoom,index:number) => 
        <div key={index} className="room-box" onClick={() =>navigate(`room/${room.roomName}`)}>{room.roomName?.toUpperCase()}</div>
        )}
      </div>
      </div>
      </>);
};

export default HomePage;
