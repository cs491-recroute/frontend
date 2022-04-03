import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Flow } from '../../types/models';
import type { AppState } from '../store';

export interface GlobalState {
    headerVisible: boolean
}

const initialState: GlobalState = {
    headerVisible: true
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setHeaderVisible: (state, action) => {
            state.headerVisible = action.payload;
        }
    }
});

export const { setHeaderVisible } = globalSlice.actions;
export const isHeaderVisible = (state: AppState) => state.global.headerVisible;

export default globalSlice.reducer;
