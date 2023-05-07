import { createSlice } from "@reduxjs/toolkit";
import update from 'immutability-helper';


export const userReducer = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        addUser: (state, action) => {
            return update(state, { $set: action.payload })
        }
    }
});

export const { addUser } = userReducer.actions;

export default userReducer.reducer;