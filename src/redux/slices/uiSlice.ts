import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface UIState {
  flowBuilder: {
    leftPanelOpen: boolean;
	rightPanelOpen: boolean;
  },
  formBuilder: {
	leftPanelOpen: boolean;
	rightPanelOpen: boolean;
  }
}

const initialState: UIState = {
	flowBuilder: {
		leftPanelOpen: false,
		rightPanelOpen: false
	},
	formBuilder: {
		leftPanelOpen: false,
		rightPanelOpen: false
	}
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
		},
		toggleFormBuilderLeftPanel: (state, action) => {
			state.formBuilder.leftPanelOpen = action.payload;
		},
		toggleFormBuilderRightPanel: (state, action) => {
			state.formBuilder.rightPanelOpen = action.payload;
		}
	},
});

export const { toggleFlowBuilderLeftPanel, toggleFlowBuilderRightPanel, toggleFormBuilderLeftPanel, toggleFormBuilderRightPanel } = uiSlice.actions;

export const isFlowBuilderLeftPanelOpen = (state: AppState) => state.ui.flowBuilder.leftPanelOpen;
export const isFlowBuilderRightPanelOpen = (state: AppState) => state.ui.flowBuilder.rightPanelOpen;
export const isFormBuilderLeftPanelOpen = (state: AppState) => state.ui.formBuilder.leftPanelOpen;
export const isFormBuilderRightPanelOpen = (state: AppState) => state.ui.formBuilder.rightPanelOpen;

export default uiSlice.reducer;
