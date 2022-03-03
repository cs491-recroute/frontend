import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import flowSlice from './slices/flowSlice';
import uiSlice from './slices/uiSlice';

export function makeStore() {
	return configureStore({
		reducer: { 
			flow: flowSlice,
			ui: uiSlice
		},
	});
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store;
