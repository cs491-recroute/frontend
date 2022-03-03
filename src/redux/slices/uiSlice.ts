import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface UIState {
  flowBuilder: {
    leftPanelOpen: boolean;
  }
}

const initialState: UIState = {
	flowBuilder: {
		leftPanelOpen: false
	},
};

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		toggleFlowBuilderLeftPanel: (state, action) => {
			state.flowBuilder.leftPanelOpen = action.payload;
		}
	},
});

export const { toggleFlowBuilderLeftPanel } = uiSlice.actions;

export const isFlowBuilderLeftPanelOpen = (state: AppState) => state.ui.flowBuilder.leftPanelOpen;

export default uiSlice.reducer;
