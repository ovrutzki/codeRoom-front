import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "../store/slicer/room.slicer";

import { IRoom } from "./interface";

export interface IRoomState{
  value:IRoom[]
  flag:boolean
}
export interface IRootState{
    room:IRoomState
}

export default configureStore({
    reducer: {
      room:roomReducer
    },
  });