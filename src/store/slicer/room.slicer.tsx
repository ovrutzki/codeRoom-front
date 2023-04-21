import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAllRooms = createAsyncThunk(
    'rooms/fetch', async () =>{
        const response = await axios.get('http://localhost:8000/api/room');
        return response.data
    }
)


export const roomSlicer = createSlice({
    name:"room",
    initialState:{
        value:[],
        singleRoom:{}
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllRooms.fulfilled, (state, action)=>{
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

export const { } = roomSlicer.actions;
export default roomSlicer.reducer;
