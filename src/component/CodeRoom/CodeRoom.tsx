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

const CodeRoom: React.FC = () => {
  const { topic } = useParams();
  const editorRef = useRef<any>();
  const roomDetails = data.find((room) => room.roomName === topic);
  const [codeToDisplay, setCodeToDisplay] = useState<string[] | undefined>([]);
  // const [codeToDisplay, setCodeToDisplay] = useState<string[] | undefined>(roomDetails?.value);
  const [userId,setUserId] = useState<string>()

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
    
    // join to specific room:
    socket.emit("specific-room", topic);
    
    socket.on("send-code", (code: any) => {
      setCodeToDisplay(code);
      console.log(codeToDisplay);
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

  window.addEventListener("unload", (event) => {
    socket.disconnect();
  });

  // useEffect(()=>{
  //   return () => {      
  //     socket.disconnect();
  //   };
  // },[])
  return (
    <div id="room-container">
      <Header />
      <h1>{topic}</h1>
      <div id="code-div">
        {roomDetails?.users === 0 ? <h2>read only</h2> : <h2>edit mode</h2>}
        {!copy ? (
          <div id="block-top">
            <p>{roomDetails?.language}</p>
            <button
              id="copy-btn"
              onClick={() => {
                setCopy(true);
                navigator.clipboard.writeText(getEditorValue());
                setInterval(() => {
                  setCopy(false);
                }, 3000);
              }}
            >
              Copy Code
            </button>
          </div>
        ) : (
          <div id="block-top">
            <button id="copy-btn">Copied!</button>
          </div>
        )}
        <Editor
          min-height="fit-content"
          height="40vw"
          width="90vw"
          theme="vs-dark"
          onMount={handelEditorDidMount}
          language={roomDetails?.language}
          value={codeToDisplay?.join("\n")}
          onChange={() => handelTyping()}
        />
        <div id="block-bottom"></div>
      </div>
    </div>
  );
};

export default CodeRoom;
