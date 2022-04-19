import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/models';
import type { AppState } from '../store';

export interface UserState {
    user: User
}

const initialState: UserState = {
    user: {
        _id: '',
        name: '',
        email: '',
        company: {
            name: '',
            isLinked: false
        },
        //profileImage: Buffer.from(''),
        roles: [],
        availableTimes: []
    }
};

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async ({ newProps, userID }: { newProps: Partial<User>; userID?: string; }) => {
        const { data: user } = await axios.put(`/api/user/updateUser`, newProps, { params: { userID } });
        return user;
    }
);

export const getUserAsync = createAsyncThunk(
    'user/getUser',
    async () => {
        const { data: user } = await axios.get(`/api/user/getUser`);
        return user;
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: { payload: User; }) => {
            state.user = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                state.user = action.payload;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                console.log(action.payload);
                state.user = action.payload;
            });
    }
});

export const { setCurrentUser } = userSlice.actions;
export const getUser = (state: AppState) => state.user.user;

export default userSlice.reducer;
