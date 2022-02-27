import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import flowSlice from './slices/flowSlice';

export function makeStore() {
	return configureStore({
		reducer: { flow: flowSlice },
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
