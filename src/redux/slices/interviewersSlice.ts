import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Interviewer } from '../../types/models';
import type { AppState } from '../store';

export interface InterviewerState {
    interviewers: Interviewer[]
}

const initialState: InterviewerState = {
    interviewers: []
};

export const getInterviewersAsync = createAsyncThunk(
    'interview/getInterviewers',
    async () => {
        const { data } = await axios.get(`/api/interviews/getInterviewers`);
        return data;
    }
);

export const interviewersSlice = createSlice({
    name: 'interviewers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getInterviewersAsync.fulfilled, (state, action) => {
                state.interviewers = action.payload;
            });
    }
});

export const getInterviewers = (state: AppState) => state.interviewers.interviewers;

export default interviewersSlice.reducer;
