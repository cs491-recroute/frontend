import { Form } from './../../types/models';
import { STAGE_TYPE } from './../../types/enums';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Flow } from '../../types/models';
import type { AppState } from '../store';
import axios from 'axios';

export interface SubmissionsState {
    currentFlow: Flow,
    applicants: any[],
    queries: { [key: string]: any },
    metadata: { [key: string]: any },
    loading: boolean
}

const initialState: SubmissionsState = {
    currentFlow: {
        _id: '', name: '', stages: [], active: false, conditions: []
    },
    applicants: [],
    queries: {},
    metadata: {},
    loading: true
};

export const fetchSubmissionsAsync = createAsyncThunk(
    'submissions/fetch',
    async (_, { getState }) => {
        const { submissions: { queries = {}, currentFlow: { _id } } } = getState() as AppState;
        const { data: result } = await axios.get(`/api/submissions/${_id}`, { params: queries });
        return result;
    }
);

export const submissionsSlice = createSlice({
    name: 'submissions',
    initialState,
    reducers: {
        setCurrentFlow: (state, action: { payload: Flow }) => {
            state.currentFlow = action.payload;
        },
        setStageFilter: (state, action: { payload: { stageIndex: number, stageCompleted: boolean } }) => {
            const { stageIndex, stageCompleted } = action.payload;
            console.log(action.payload);
            state.queries = { ...state.queries, stageIndex, stageCompleted };
        },
        resetStageFilter: state => {
            state.queries.stageIndex = undefined;
            state.queries.stageCompleted = undefined;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubmissionsAsync.fulfilled, (state, action) => {
                const { docs: applicants, ...metadata } = action.payload;
                state.applicants = applicants;
                state.metadata = metadata;
                state.loading = false;
            })
            .addCase(fetchSubmissionsAsync.pending, state => {
                state.loading = true;
            })
    }
});

export const { setCurrentFlow, setStageFilter, resetStageFilter } = submissionsSlice.actions;

export const getCurrentFlow = (state: AppState) => state.submissions.currentFlow;
export const getStageCounts = (state: AppState) => state.submissions.metadata.stageCounts;
export const getApplicants = (state: AppState) => state.submissions.applicants;
export const getQueries = (state: AppState) => state.submissions.queries;
export const getActiveStageFilter = (state: AppState) => {
    const { stageIndex, stageCompleted } = state.submissions.queries;
    return { stageIndex, stageCompleted };
};
export const getLoading = (state: AppState) => state.submissions.loading;

export default submissionsSlice.reducer;
