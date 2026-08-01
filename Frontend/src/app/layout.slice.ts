import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface LayoutState {
  sidebarOpen: boolean;
}

const initialState: LayoutState = {
  sidebarOpen: false,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = layoutSlice.actions;
export default layoutSlice.reducer;
