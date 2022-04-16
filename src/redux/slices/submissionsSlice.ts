import { createSlice } from '@reduxjs/toolkit';
import { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface SubmissionsState {
    currentFlow: Flow
}

const initialState: SubmissionsState = {
    currentFlow: {
        _id: '', name: '', stages: [], active: false, conditions: []
    }
};

export const submissionsSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
        setCurrentFlow: (state, action) => {
            state.currentFlow = action.payload;
        }
    }
});

export const { setCurrentFlow } = submissionsSlice.actions;

export const getCurrentFlow = (state: AppState) => state.submissions.currentFlow;

export default submissionsSlice.reducer;
