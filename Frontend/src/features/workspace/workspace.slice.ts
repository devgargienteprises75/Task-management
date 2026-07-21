import type { workspace, workspaceState } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: workspaceState = {
  workspace: null,
  allWorkspaces: [],
  isLoading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<workspace>) => {
      state.workspace = action.payload;
    },
    setAllWorkspaces: (state, action: PayloadAction<workspace[]>) => {
      state.allWorkspaces.push(...action.payload);
    },
    setUpdatedWorkspace: (state, action: PayloadAction<workspace>) => {
      const index = state.allWorkspaces.findIndex(w => w._id === action.payload._id)
      if(index !== -1) state.allWorkspaces[index] = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setWorkspace, setLoading, setAllWorkspaces, setUpdatedWorkspace } =
  workspaceSlice.actions;

export default workspaceSlice.reducer;
