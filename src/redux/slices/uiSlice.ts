import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface UIState {
  flowBuilder: {
    leftPanelOpen: boolean;
	rightPanelOpen: boolean;
  }
}

const initialState: UIState = {
	flowBuilder: {
		leftPanelOpen: false,
		rightPanelOpen: false,
	},
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleFlowBuilderLeftPanel: (state, action) => {
			state.flowBuilder.leftPanelOpen = action.payload;
		},
		toggleFlowBuilderRightPanel: (state, action) => {
			state.flowBuilder.rightPanelOpen = action.payload;
		}
	},
});

export const { toggleFlowBuilderLeftPanel, toggleFlowBuilderRightPanel } = uiSlice.actions;

export const isFlowBuilderLeftPanelOpen = (state: AppState) => state.ui.flowBuilder.leftPanelOpen;
export const isFlowBuilderRightPanelOpen = (state: AppState) => state.ui.flowBuilder.rightPanelOpen;

export default uiSlice.reducer;
