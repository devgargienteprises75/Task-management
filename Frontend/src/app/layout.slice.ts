import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

export interface LayoutState {
  sidebarOpen: boolean;
  theme: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark" || saved === "system") {
    return saved;
  }
  return "light";
};

const initialState: LayoutState = {
  sidebarOpen: false,
  theme: getInitialTheme(),
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
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setTheme } = layoutSlice.actions;
export default layoutSlice.reducer;
