import React, { useState, useRef, useEffect, useMemo } from "react";
import "./CodeRoom.css";
import { useParams } from "react-router-dom";
import data from "../../rooms.json";
import "highlight.js/styles/github.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Editor from "@monaco-editor/react";
import Header from "../Header/Header";
import { io } from "socket.io-client";
import GeneralButton from "../GeneralButton/GeneralButton";

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

  const handelEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const getEditorValue = () => {
    return editorRef.current.getValue();
  };
  const [copy, setCopy] = useState<boolean>(false);

  // socket
  const socket = useMemo(
    () => io("http://localhost:8000", { query: { roomTopic: topic } }),
    [topic]
  );
  
  useEffect(() => {
    setUserId(socket.id);
    socket.on('connect', () => {
      console.log("user", socket.id);
    });
    
    
    // join to specific room:
    socket.emit("specific-room", topic);
    socket.on("mentor-id", (mentorId:string)=>{
      console.log("mentorId", mentorId);
      console.log("user", socket.id);
      setMentorId(mentorId)
    })
    if(userId === mentorId){
      setReadOnlyMode(true)
      console.log(readOnlyMode);
    } else {
      setReadOnlyMode(false)
      console.log('else',readOnlyMode);
      
    }
    
    socket.on("send-code", (code: any) => {
      setCodeToDisplay(code);
    });
    
    console.log('after',readOnlyMode);
    
    
    return () => {
      socket.off("specific-room")
      socket.off("send-code")
    };
   
  }, [socket,mentorId]);


  // sending the user code:
  const handelTyping = () => {
    socket.emit("user-typing", editorRef.current.getValue(), topic);
  };
  //  getting others user code:
  socket.on("send-code", (code: any) => {
    setCodeToDisplay(code);
  });

  window.addEventListener("unload", (event) => {
    socket.disconnect();
  });

  useEffect(()=>{
    socket.connect()
    return () => {  
      socket.disconnect();
    };
  },[])

  const handelSave = () =>{
    setIsSave(true)
// api request to save the code:



    setTimeout(function() {setIsSave(false)},3000)
  }
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
    </div>
  );
};

export default CodeRoom;
