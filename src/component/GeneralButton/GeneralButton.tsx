import React from "react";
import "./GeneralButton.css";

interface IButton{
    text:string,
    bgcolor:string,
    textColor:string
    
}
const GeneralButton: React.FC<IButton> = (props:IButton) => {
      return (<>
            <button style={{backgroundColor:`${props.bgcolor}`, color:`${props.textColor}`}}>{props.text}</button>
        </>
      )
    }

export default GeneralButton;