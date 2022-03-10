import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface FlowsState {
  flows: Flow[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: FlowsState = {
	flows: [],
	status: 'idle',
};

export const fetchFlowsAsync = createAsyncThunk(
	'flow/fetchFlows',
	async () => {
		const { data } = await axios.get('/api/flows');
		return data;
	}
);

export const createFlowAsync = createAsyncThunk(
	'flow/createFlow',
	async (flowData: { name: string; startDate?: string; endDate?: string; }) => {
		const { data: { flow } } = await axios.post('/api/flows/create', flowData);
		return flow;
	}
);

export const flowsSlice = createSlice({
	name: 'flows',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFlowsAsync.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchFlowsAsync.fulfilled, (state, action) => {
				state.status = 'idle';
				state.flows = action.payload;
			})
			.addCase(createFlowAsync.fulfilled, (state, action) => {
				state.flows.push(action.payload);
			});
	},
});

export const getFlows = (state: AppState) => state.flows.flows;
export const isFlowsReady = (state: AppState) => state.flows.status === 'idle';

export default flowsSlice.reducer;