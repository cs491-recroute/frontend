import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STAGE_TYPE } from '../../types/enums';
import { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface FlowBuilderState {
	ui: {
		leftPanelStatus: STAGE_TYPE | false;
		rightPanelStatus: {
            stageType: STAGE_TYPE | false;
            stageId: string;
        };
	},
	currentFlow: Flow
}

const initialState: FlowBuilderState = {
    ui: {
        leftPanelStatus: false,
        rightPanelStatus: {
            stageType: false,
            stageId: ''
        }
    },
    currentFlow: {
        _id: '', name: '', stages: [], active: false, conditions: []
    }
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
        toggleLeftPanel: (state, action: { payload: STAGE_TYPE | false; }) => {
            state.ui.leftPanelStatus = action.payload;
        },
        toggleRightPanel: (state, action: {payload: {stageType: STAGE_TYPE | false, stageId: string}}) => {
            state.ui.rightPanelStatus = action.payload;
        },
        setCurrentFlow: (state, action) => {
            state.currentFlow = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(addStageAsync.fulfilled, (state, action) => {
                state.currentFlow.stages.push(action.payload);
                state.ui.leftPanelStatus = false;
            });
    }
});

export const { toggleLeftPanel, toggleRightPanel, setCurrentFlow } = flowBuilderSlice.actions;

export const getLeftPanelStatus = (state: AppState) => state.flowBuilder.ui.leftPanelStatus;
export const getRightPanelStatus = (state: AppState) => state.flowBuilder.ui.rightPanelStatus;
export const getCurrentFlow = (state: AppState) => state.flowBuilder.currentFlow;

export default flowBuilderSlice.reducer;
