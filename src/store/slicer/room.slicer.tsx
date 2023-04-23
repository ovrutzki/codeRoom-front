import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { stat } from 'fs';

export const fetchAllRooms = createAsyncThunk(
    'rooms/fetch', async () =>{
        const response = await axios.get('https://eran-coderoom-backend.onrender.com/api/room');
        return response.data
    }
)


export const roomSlicer = createSlice({
    name:"room",
    initialState:{
        value:[],
        flag:false
    },
    reducers: {
        getRoomsData: (state,action) => {
            state.value = action.payload

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllRooms.fulfilled, (state, action)=>{
            console.log(action.payload);
            state.value = action.payload
            console.log("fulfilled");
            
        });
        builder.addCase(fetchAllRooms.pending,(state,action)=>{
            console.log("pending");
            
        });
        builder.addCase(fetchAllRooms.rejected,(state,action)=>{
            console.log("rejected");
            
        });
    }
})

export const { getRoomsData } = roomSlicer.actions;
export default roomSlicer.reducer;
