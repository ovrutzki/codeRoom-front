import React, { useState, useRef } from "react";
import "./CodeRoom.css";
import { useParams } from "react-router-dom";
import data from '../../rooms.json'
import "highlight.js/styles/github.css";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Editor from '@monaco-editor/react'
import Header from "../Header/Header";
const CodeRoom: React.FC = () => {
    let { topic } = useParams();
    const editorRef = useRef<any>()

    const handelEditorDidMount = (editor:any, monaco:any) => {
      editorRef.current = editor
    }

    const getEditorValue = () =>{
     return editorRef.current.getValue()
    }
    const roomDetails = data.find((room) => room.roomName === topic)
    const codeString =`import SyntaxHighlighter from 'react-syntax-highlighter';
    import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
    
    const CodeRoom: React.FC = () => {
        let { topic } = useParams();
    
        const roomDetails = data.find((room) => room.roomName === topic)
    
          return (<>
        }
    
    export default CodeRoom;`
        const [copy,setCopy] = useState<boolean>(false)
      return (
      <div id="room-container">
        <Header />
      <h1>{topic}</h1>
        <div id="code-div">
      {roomDetails?.users === 0 ? <h2 >read only</h2> : <h2 >edit mode</h2>}
          {!copy ? (<div id="block-top">
            <p>{roomDetails?.language}</p>
            <button id="copy-btn" onClick={() =>{
               setCopy(true)
              navigator.clipboard.writeText(getEditorValue())
              setInterval(()=>{
                setCopy(false)
              },3000)
            }
            }>
              Copy Code</button>
          </div>) : (<div id="block-top">
            <button id="copy-btn">
              Copied!</button>
          </div>) }
          <Editor 
          min-height="fit-content"
          height="40vw"
          width="90vw"
          theme="vs-dark"
          onMount={handelEditorDidMount}
          language={roomDetails?.language}
          value={roomDetails?.value}
          />
          <div id="block-bottom"></div>
        </div>
        </div>
      )
    }

export default CodeRoom;


