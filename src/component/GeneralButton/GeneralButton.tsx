import React from "react";
import "./GeneralButton.css";

interface IButton extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    text:string,
    bgcolor:string,
    textColor:string,
    function?:()=>void    
}
const GeneralButton: React.FC<IButton> = (props:IButton) => {
      return (<>
            <button onClick={props.function} style={{backgroundColor:`${props.bgcolor}`, color:`${props.textColor}`}}>{props.text}</button>
        </>
      )
    }

export default GeneralButton;