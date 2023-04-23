import React, { useState, useRef, useEffect, useMemo } from "react";
import "./CodeRoom.css";
import { useParams } from "react-router-dom";
import data from "../../rooms.json";
import "highlight.js/styles/github.css";
import Editor from "@monaco-editor/react";
import Header from "../Header/Header";
import { io } from "socket.io-client";
import GeneralButton from "../GeneralButton/GeneralButton";
import axios from "axios";



const CodeRoom: React.FC = () => {
  const { topic } = useParams();
  const editorRef = useRef<any>();
  const roomDetails = data.find((room) => room.roomName === topic);
  const [codeToDisplay, setCodeToDisplay] = useState<string[] | undefined>([]);
  // const [codeToDisplay, setCodeToDisplay] = useState<string[] | undefined>(roomDetails?.value);
  const [userId,setUserId] = useState<string>()
  const [mentorId,setMentorId] = useState<string>()
  const [readOnlyMode,setReadOnlyMode] = useState<boolean>()
  const [isSave,setIsSave] = useState<boolean>(false)
  const [ipAddress, setIpAddress] = useState<string>('')

  // getting the editor value:
  const handelEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const getEditorValue = () => {
    return editorRef.current.getValue();
  };
  const [copy, setCopy] = useState<boolean>(false);
let test = 0
  // socket
  const socket = useMemo(
    () => io("http://localhost:8000", { query: { roomTopic: topic } }),
    [topic]
  );
  
  useEffect(() => {
    // socket.on('connect', () => {
    //   setUserId(socket.io.engine.id);
    // });
    socket.on('ip-address', (ip) => {
     setIpAddress(ip);
     sessionStorage.setItem('ip-address', ip)
     console.log('address: ',ipAddress);
     console.log("ip",ip);
     
    });
    
    // join to specific room:
    socket.emit("specific-room", topic);
    socket.on("mentor-id", (mentorId:string)=>{
      setMentorId(mentorId)
      console.log('mentorId',mentorId);
      console.log('address2: ',ipAddress);

      if (String(mentorId) === sessionStorage.getItem('ip-address')) {
        setReadOnlyMode(true)
        console.log(readOnlyMode);
      }
    })
   
    socket.on("send-code", (code: any) => {
      setCodeToDisplay(code);
    });

    return () => {
      socket.off("specific-room")
      socket.off("send-code")
    };
   
  }, [socket]);


  // sending the user code:
  const handelTyping = () => {
    socket.emit("user-typing", editorRef.current.getValue(), topic);
  };
  //  getting others user code:
  socket.on("send-code", (code: any) => {
    setCodeToDisplay(code);
  });

  // window.addEventListener("unload", (event) => {
  //   socket.disconnect();
  // });


  const handelSave = () =>{
    setIsSave(true)
// api request to save the code:
    const sendCodeToDb = async (code:string) => {
      const codeSplit = code.split('\n')
      try {
        const sendCode = await axios.post('http://localhost:8000/api/room/saveCode',{
          roomCode: codeSplit,
          roomName:topic
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.log(error);
      }
    }
    sendCodeToDb(editorRef.current.getValue())
    setTimeout(function() {setIsSave(false)},3000)
  }

  const notMentorStatus = ()=> {
    socket.emit('not-mentor')
    setReadOnlyMode(false)
  }
  const mentorStatus = ()=> {
    socket.emit('is-mentor')
    setReadOnlyMode(true)
  }
  useEffect(()=>{
    socket.connect()
    
    return () => {  
      console.log('disconnect');
      
      socket.disconnect();
    };
  },[])
  return (
    <div id="room-container">
      <Header />
      <h1>{topic}</h1>
      <div id="code-div">
        <div id="upper-div">
        {readOnlyMode ? <h2>read only</h2> : <h2>edit mode</h2>}
        {!isSave ?  <GeneralButton function={handelSave} text={"save code"} bgcolor={"#5DE2A4"} textColor={"#303641"} /> :  <GeneralButton text={"Saved!"} bgcolor={"#5DE2A4"} textColor={"#303641"} />}
        </div>
        <button></button>
          <div id="block-top">
            <p>{roomDetails?.language}</p>
            <button
              id="copy-btn"
              onClick={() => {setCopy(true);
                navigator.clipboard.writeText(getEditorValue());
                setInterval(() => {
                  setCopy(false);
                }, 3000);
              }}
            >
              {!copy ? ("Copy Code "
              ) : (
          "Copied!"
        )}
            </button>
          </div>
        
        <Editor
          min-height="fit-content"
          height="40vw"
          width="90vw"
          theme="vs-dark"
          onMount={handelEditorDidMount}
          language={roomDetails?.language}
          value={codeToDisplay?.join("\n")}
          onChange={() => handelTyping()}
          options={{readOnly: readOnlyMode}}
          
        />
        <div id="block-bottom"></div>
      </div>
      {readOnlyMode ? <GeneralButton function={notMentorStatus} text={"I`m NOT a mentor"} bgcolor={"#5DE2A4"} textColor={"#303641"} /> :
      <GeneralButton function={mentorStatus} text={"I`m a mentor"} bgcolor={"#46c087"} textColor={"#303641"} />}
    </div>
  );
};

export default CodeRoom;
