import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface FlowBuilderState {
	ui: {
		leftPanelOpen: boolean;
		rightPanelOpen: boolean;
	}
}

const initialState: FlowBuilderState = {
	ui: {
		leftPanelOpen: false,
		rightPanelOpen: false
	}
};

export const flowBuilderSlice = createSlice({
	name: 'flowBuilder',
	initialState,
	reducers: {
		toggleLeftPanel: (state, action) => {
			state.ui.leftPanelOpen = action.payload;
		},
		toggleRightPanel: (state, action) => {
			state.ui.rightPanelOpen = action.payload;
		}
	},
});

export const { toggleLeftPanel, toggleRightPanel } = flowBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.flowBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.flowBuilder.ui.rightPanelOpen;

export default flowBuilderSlice.reducer;
