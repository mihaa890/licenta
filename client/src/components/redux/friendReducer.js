import { createSlice } from "@reduxjs/toolkit";
import update from 'immutability-helper';


export const friendReducer = createSlice({
    name: 'friends',
    initialState: [],
    reducers: {
        addFriend: (state, action) => {
            return update(state, { $set: action.payload })
        }
    }
});

export const { addFriend } = friendReducer.actions;

export default friendReducer.reducer;