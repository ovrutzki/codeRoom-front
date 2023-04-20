import React, { useState } from "react";
import "./CodeRoom.css";
import { useParams } from "react-router-dom";
import data from '../../rooms.json'
// import daddta from '../../../public/assets/icons/clipboard-outline.svg'
import "highlight.js/styles/github.css";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeRoom: React.FC = () => {
    let { topic } = useParams();

    const roomDetails = data.find((room) => room.roomName === topic)
    const codeString =`import SyntaxHighlighter from 'react-syntax-highlighter';
    import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
    
    const CodeRoom: React.FC = () => {
        let { topic } = useParams();
    
        const roomDetails = data.find((room) => room.roomName === topic)
        const codeString = '(num) => num + 1';
    console.log(topic);
    
          return (<>
          <h1>{topic}</h1>
    
          <input type="text" />
    
          <SyntaxHighlighter language={} style={atomOneDark}>
          {codeString}
        </SyntaxHighlighter>
            </>
          )
        }
    
    export default CodeRoom;`
        const [copy,setCopy] = useState<boolean>(false)
      return (
      <div id="room-container">
      <h1>{topic}</h1>
        <div id="code-div">
          {!copy ? (<div id="block-top">
            <button id="copy-btn" onClick={() =>{
               setCopy(true)
              navigator.clipboard.writeText(codeString)
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
      <SyntaxHighlighter  language={`${topic}`} style={atomOneDark}>
      {codeString}
    </SyntaxHighlighter>
        </div>
        </div>
      )
    }

export default CodeRoom;


