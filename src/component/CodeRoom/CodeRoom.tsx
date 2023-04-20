import React from "react";
import "./CodeRoom.css";
import { useParams } from "react-router-dom";


const CodeRoom: React.FC = (props) => {
    let { topic } = useParams();
    
      return (<>
      <h1>{topic}</h1>

        </>
      )
    }

export default CodeRoom;