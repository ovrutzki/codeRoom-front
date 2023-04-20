import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";


const Header: React.FC = () => {
    const navigate = useNavigate()
    const [nickName, setNickName] = useState<string>("Add nick name")
    sessionStorage.getItem('nickName')
    useEffect(()=>{
        let name = sessionStorage.getItem('nickName') || "Add nick name"
        return setNickName(name);
    },[])
      return (<>
            <header>
                <div onClick={() => navigate("/")}>Home</div>
                <div><img id="logo" src="/assets/icons/logo-no-background.svg" alt="fgf" /></div>
                <div onClick={()=>{
                   let promptValue =  prompt('add your nick name') || "Add nick name"
                    setNickName(promptValue) 
                    sessionStorage.setItem('nickName',promptValue )
                }}>{nickName}</div>
            </header>
        </>
      )
    }

export default Header;