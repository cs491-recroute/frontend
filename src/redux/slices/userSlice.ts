import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { TimeSlot, User } from '../../types/models';
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
    async (newProps: {name: string, value: string} )  => {
        const { data: user } = await axios.put(`/api/user/updateUser`, newProps);
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

export const updateTimeSlotsAsync = createAsyncThunk(
    'user/updateTimeSlots',
    async (timeSlots : TimeSlot[]) => {
        const { data: user } = await axios.put(`/api/user/updateTimeSlots`, timeSlots);
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
                state.user.name = action.payload.name;
            })
            .addCase(updateTimeSlotsAsync.fulfilled, (state, action) => {
                state.user.availableTimes = action.payload.availableTimes;
            })
            .addCase(getUserAsync.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    }
});

export const { setCurrentUser } = userSlice.actions;
export const getUser = (state: AppState) => state.user.user;

export default userSlice.reducer;
