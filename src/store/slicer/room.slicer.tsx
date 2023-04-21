import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { stat } from 'fs';

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
        flag:false
    },
    reducers: {
        handelFlag: (state) => {
            state.flag = !state.flag

        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllRooms.fulfilled, (state, action)=>{
            console.log(action.payload);
            state.value = action.payload
            console.log("fulfilled");
            state.flag = !state.flag

            
        });
        builder.addCase(fetchAllRooms.pending,(state,action)=>{
            console.log("pending");
            
        });
        builder.addCase(fetchAllRooms.rejected,(state,action)=>{
            console.log("rejected");
            
        });
    }
})

export const { handelFlag } = roomSlicer.actions;
export default roomSlicer.reducer;
