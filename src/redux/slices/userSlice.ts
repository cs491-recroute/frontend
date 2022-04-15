import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../../types/models';
import type { AppState } from '../store';

export interface UserState {
    user: User
}
  
const initialState: UserState = {
    user: {_id: '',
        name: '',
        email: '',
        company: '',
        //profileImage: Buffer.from(''),
        roles: [],
        availableTimes: [],
        isAdmin: false}
};

export const updateUserAsync = createAsyncThunk(
    'user/updateUser',
    async ({ newProps, userID }: { newProps: Partial<User>; userID?: string; }) => {
        const { data: user } = await axios.put(`/api/user/updateUser`, newProps, { params: { userID } });
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
                console.log(action.payload)
                state.user = action.payload;
            });
    }
});

export const { setCurrentUser } = userSlice.actions;
export const getUser = (state: AppState) => state.user.user;

export default userSlice.reducer;
