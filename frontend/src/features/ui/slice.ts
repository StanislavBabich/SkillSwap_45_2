import { createSlice } from '@reduxjs/toolkit';

export interface UiState {
  isSkillsMenuOpen: boolean;
}

const initialState: UiState = {
  isSkillsMenuOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSkillsMenu: (state) => {
      state.isSkillsMenuOpen = true;
    },
    closeSkillsMenu: (state) => {
      state.isSkillsMenuOpen = false;
    },
  },
});

export const { openSkillsMenu, closeSkillsMenu } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;