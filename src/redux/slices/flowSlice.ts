import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface FlowState {
  flows: Flow[]
  status: 'idle' | 'loading' | 'failed'
}

const initialState: FlowState = {
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

export const flowSlice = createSlice({
	name: 'flow',
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
			});
	},
});

export const getFlows = (state: AppState) => state.flow.flows;
export const isFlowsReady = (state: AppState) => state.flow.status === 'idle';

export default flowSlice.reducer;
