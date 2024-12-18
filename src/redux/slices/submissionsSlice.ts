import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Flow } from '../../types/models';
import type { AppState } from '../store';
import axios from 'axios';
import { toast } from 'react-toastify';
import { translate } from '../../utils';

export interface SubmissionsState {
    currentFlow: Flow,
    applicants: any[],
    queries: { [key: string]: any },
    metadata: { [key: string]: any },
    loading: boolean
}

const initialState: SubmissionsState = {
    currentFlow: {
        _id: '', name: '', stages: [], active: false, conditions: [], favorite: false, archived: false
    },
    applicants: [],
    queries: { filters: {} },
    metadata: {},
    loading: true
};

export const fetchSubmissionsAsync = createAsyncThunk(
    'submissions/fetch',
    async (_, { getState }) => {
        const { submissions: { queries = {}, currentFlow: { _id } } } = getState() as AppState;
        const { data: result } = await axios.post(`/api/submissions/${_id}`, queries);
        return result;
    }
);

export const applicantNextStageAsync = createAsyncThunk(
    'submissions/applicantNextStage',
    async (id: string, { dispatch }) => {
        try {
            await axios.get(`/api/submissions/next/${id}`);
            toast(translate('Successful'), {
                type: 'success',
                position: 'bottom-right',
                hideProgressBar: true
            });
            dispatch(fetchSubmissionsAsync());
            return id;
        } catch (error: any) {
            toast(translate(error?.response?.data || 'Error occured!'), {
                type: 'error',
                position: 'bottom-right',
                hideProgressBar: true
            });
        }
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
            state.queries.page = 1;
            state.queries = { ...state.queries, stageIndex, stageCompleted };
        },
        resetStageFilter: state => {
            state.queries.stageIndex = undefined;
            state.queries.stageCompleted = undefined;
        },
        setSortQuery: (state, action: { payload: { sort_by: string, order_by?: string } }) => {
            const { sort_by, order_by } = action.payload;
            if (!order_by) {
                state.queries.sort_by = undefined;
                state.queries.order_by = undefined;
            } else {
                state.queries = { ...state.queries, sort_by, order_by };
            }
        },
        setFilterQuery: (state, action: { payload: { filter_text: string, filter_by: string } }) => {
            const { filter_text, filter_by } = action.payload;
            if (!filter_text) {
                state.queries.filters[filter_by] = undefined;
            } else {
                state.queries = { ...state.queries, filters: { ...state.queries.filters, [filter_by]: filter_text } };
            }
        },
        clearFilters: state => {
            state.queries.filters = {};
        },
        setPaginationQuery: (state, action: { payload: { page: number, limit: number } }) => {
            const { page, limit } = action.payload;
            state.queries = { ...state.queries, page, limit };
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchSubmissionsAsync.fulfilled, (state, action) => {
                const { docs: applicants, stageCounts, ...metadata } = action.payload;
                state.applicants = applicants;
                state.metadata = metadata;
                state.loading = false;
                state.metadata.stageCounts = state.currentFlow.stages.reduce((acc, stage, index) => {
                    const notCompletedInfo = stageCounts.find(({ stageIndex, completed }: any) => (stageIndex === index && !completed)) || { stageIndex: index, completed: false, count: 0 };
                    const completedInfo = stageCounts.find(({ stageIndex, completed }: any) => (stageIndex === index && completed)) || { stageIndex: index, completed: true, count: 0 };
                    acc.push(notCompletedInfo, completedInfo);
                    return acc;
                }, [] as any[]);
            })
            .addCase(fetchSubmissionsAsync.pending, state => {
                state.loading = true;
            })
            .addCase(applicantNextStageAsync.pending, state => {
                state.loading = true;
            });
    }
});

export const { setCurrentFlow, setStageFilter, resetStageFilter, setSortQuery, setFilterQuery, clearFilters, setPaginationQuery } = submissionsSlice.actions;

export const getCurrentFlow = (state: AppState) => state.submissions.currentFlow;
export const getStageCounts = (state: AppState) => state.submissions.metadata.stageCounts;
export const getApplicants = (state: AppState) => state.submissions.applicants;
export const getQueries = (state: AppState) => state.submissions.queries;
export const getActiveStageFilter = (state: AppState) => {
    const { stageIndex, stageCompleted } = state.submissions.queries;
    return { stageIndex, stageCompleted };
};
export const getLoading = (state: AppState) => state.submissions.loading;
export const getMetadata = (state: AppState) => state.submissions.metadata;

export default submissionsSlice.reducer;
