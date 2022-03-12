import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STAGE_TYPE } from '../../types/enums';
import { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface FlowBuilderState {
	ui: {
		leftPanelOpen: boolean;
		rightPanelOpen: boolean;
	},
	currentFlow: Flow
}

const initialState: FlowBuilderState = {
	ui: {
		leftPanelOpen: false,
		rightPanelOpen: false
	},
	currentFlow: { _id: '', name: '', stages: [], active: false, conditions: [] }
};

export const addStageAsync = createAsyncThunk(
	'flow/addStage',
	async (stageData: { type: STAGE_TYPE; stageID: string; }, { getState }) => {
		const { flowBuilder: { currentFlow: { _id: flowID, startDate, endDate } = {} } } = getState() as AppState;
		const { data: { stage } } = await axios.post(`/api/flows/${flowID}/stage`, {
			...stageData,
			...(startDate && endDate && { startDate, endDate })
		});
		return stage;
	}
);


export const flowBuilderSlice = createSlice({
	name: 'flowBuilder',
	initialState,
	reducers: {
		toggleLeftPanel: (state, action) => {
			state.ui.leftPanelOpen = action.payload;
		},
		toggleRightPanel: (state, action) => {
			state.ui.rightPanelOpen = action.payload;
		},
		setCurrentFlow: (state, action) => {
			state.currentFlow = action.payload;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(addStageAsync.fulfilled, (state, action) => {
				state.currentFlow.stages.push(action.payload);
				state.ui.leftPanelOpen = false;
			});
	}
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentFlow } = flowBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.flowBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.flowBuilder.ui.rightPanelOpen;
export const getCurrentFlow = (state: AppState) => state.flowBuilder.currentFlow;

export default flowBuilderSlice.reducer;
