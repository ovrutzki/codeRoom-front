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
import { IRootState } from "../../store/store";
import { IRoom } from "../../store/interface";

const CodeRoom: React.FC = () => {
  const { topic } = useParams();
  const editorRef = useRef<any>();
  const roomsData: any = sessionStorage.getItem("all-rooms");
  const roomsObject = JSON.parse(roomsData);
  const roomDetails: IRoom = roomsObject?.find(
    (room: IRoom) => room.roomName === topic
  );

  const [codeToDisplay, setCodeToDisplay] = useState<string[] | undefined>(
    roomDetails.value
  );
  const [userId, setUserId] = useState<string>();
  const [mentorId, setMentorId] = useState<string>();
  const [readOnlyMode, setReadOnlyMode] = useState<boolean>();
  const [isSave, setIsSave] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [userNickName, setUserNickName] = useState<string | null>("")

  // getting the editor value:
  const handelEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const getEditorValue = () => {
    return editorRef.current.getValue();
  };
  const [copy, setCopy] = useState<boolean>(false);
  let test = 0;
  // socket
  const socket = useMemo(
    () =>
      io("https://eran-coderoom-backend.onrender.com", {
        query: { roomTopic: topic },
      }),
    [topic]
  );

  useEffect(() => {
    // get the api and save in session storage:
    socket.on("ip-address", (ip) => {
      setIpAddress(ip);
      sessionStorage.setItem("ip-address", ip);
    });

    // join to specific room:
    socket.emit("specific-room", topic);
    socket.on("mentor-id", (mentorId: string) => {
      setMentorId(mentorId);
      console.log("mentorId", mentorId);

      if (String(mentorId) === sessionStorage.getItem("ip-address")) {
        setReadOnlyMode(true);
      }
    });
    //  ===========================================
    return () => {
      socket.off("specific-room");
      socket.off("send-code");
    };
  }, [socket]);

  // overload solution:
  let lastUpdate = 0;
  // sending the user code:
  const handelTyping = () => {
    setCodeToDisplay(editorRef.current.getValue().split("\n"));
    if(sessionStorage.getItem('nickName') !== null){
      setUserNickName(sessionStorage.getItem('nickName'))
    } else {
      setUserNickName(sessionStorage.getItem('ip=address'))
    }
    if (Date.now() - lastUpdate > 300) {
      socket.emit(
        "user-typing",
        editorRef.current.getValue().split("\n"), userNickName,
        topic
      );
      console.log("if");
    } else {
      console.log("else",(Date.now() - lastUpdate));
      setTimeout(() => {
        socket.emit(
          "user-typing",
          editorRef.current.getValue().split("\n"),userNickName,topic);
      }, 700 - (Date.now() - lastUpdate));
    }
    lastUpdate = Date.now();
  };

  //  getting others user code:
  socket.on("send-code", (code: any,userName:string) => {
    setCodeToDisplay(code);
    setUserNickName(userName)
  });

  const handelSave = () => {
    setIsSave(true);
    // api request to save the code:
    const sendCodeToDb = async (code: string) => {
      const codeSplit = code.split("\n");
      try {
        const sendCode = await axios.post(
          "https://eran-coderoom-backend.onrender.com/api/room/saveCode",
          {
            roomCode: codeSplit,
            roomName: topic,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    sendCodeToDb(editorRef.current.getValue());
    setTimeout(function () {
      setIsSave(false);
    }, 3000);
  };

  const notMentorStatus = () => {
    socket.emit("not-mentor");
    setReadOnlyMode(false);
  };
  const mentorStatus = () => {
    socket.emit("is-mentor");
    setReadOnlyMode(true);
  };
  socket.on("not-mentor", () => {
    setReadOnlyMode(false);
  });

  // cleanup function

  useEffect(() => {
    socket.connect();

    return () => {
      console.log("disconnect");

      socket.disconnect();
    };
  }, []);

  return (
    <div id="room-container">
      <Header />
      <h1>{topic}</h1>
      <div id="code-div">
        <div id="upper-div">
          {readOnlyMode ? (
            <div>
              <h2>read only</h2>
              <p>MENTOR</p>
            </div>
          ) : (
            <div>
              <h2>edit mode</h2>
              <p>STUDENT</p>
            </div>
          )}
          {readOnlyMode ? (
            <GeneralButton
              function={notMentorStatus}
              text={"I`m NOT a mentor"}
              bgcolor={"#5DE2A4"}
              textColor={"#303641"}
            />
          ) : (
            <GeneralButton
              function={mentorStatus}
              text={"I`m a mentor"}
              bgcolor={"#46c087"}
              textColor={"#303641"}
            />
          )}
          {!isSave ? (
            <GeneralButton
              function={handelSave}
              text={"save code"}
              bgcolor={"#5DE2A4"}
              textColor={"#303641"}
            />
          ) : (
            <GeneralButton
              text={"Saved!"}
              bgcolor={"#5DE2A4"}
              textColor={"#303641"}
            />
          )}
        </div>
        <div id="block-top">
          <p>{roomDetails?.language}</p>
          <p>Last Update By:{userNickName}</p>
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
            {!copy ? "Copy Code " : "Copied!"}
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
          // onChange={() =>handelTyping}
          onChange={() => {
              handelTyping();
              setCodeToDisplay(editorRef.current.getValue().split("\n"));
          }}
          options={{ readOnly: readOnlyMode }}
        />
        <div id="block-bottom"></div>
      </div>
      <div id="downer-div"></div>
    </div>
  );
};

export default CodeRoom;
