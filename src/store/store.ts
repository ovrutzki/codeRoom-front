import { configureStore } from "@reduxjs/toolkit";
import roomsReducer from "../store/slicer/room.slicer";

import { IRoom } from "./interface";

export interface IRootState{
    rooms:IRoom
}

export default configureStore({
    reducer: {
      rooms:roomsReducer
    },
  });