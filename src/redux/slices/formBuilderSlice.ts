import { createSlice } from '@reduxjs/toolkit';
import type { AppState } from '../store';

export interface FormBuilderState {
	ui: {
		leftPanelOpen: boolean;
		rightPanelOpen: boolean;
	}
}

const initialState: FormBuilderState = {
	ui: {
		leftPanelOpen: false,
		rightPanelOpen: false
	}
};

export const formBuilderSlice = createSlice({
	name: 'formBuilder',
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

export const { toggleLeftPanel, toggleRightPanel } = formBuilderSlice.actions;

export const isLeftPanelOpen = (state: AppState) => state.formBuilder.ui.leftPanelOpen;
export const isRightPanelOpen = (state: AppState) => state.formBuilder.ui.rightPanelOpen;

export default formBuilderSlice.reducer;