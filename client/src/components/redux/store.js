import {configureStore} from '@reduxjs/toolkit';
import friendReducer from './friendReducer';
import userReducer from './userReducer';

const store = configureStore({
    reducer: {
        friends : friendReducer,
        users: userReducer,
    },
});

export default store;