import type { UpdateWorkspace, workspace } from "@/types";
import { workspaceApi } from "../services/workspace.api";
import { useDispatch } from "react-redux";
import { setAllWorkspaces, setLoading, setUpdatedWorkspace, setWorkspace } from "../workspace.slice";

const useWorkspace = () => {
  const { createWorkspace, getWorkspaces, editWorkspace } = workspaceApi;
  const dispatch = useDispatch();

  const handleCreateWorkspace = async (workspaceDetail: workspace) => {
    dispatch(setLoading(true));

    try {
      const res = await createWorkspace(workspaceDetail);
      dispatch(setWorkspace(res.workspace));
      dispatch(setAllWorkspaces([res.workspace]));
      return {
        success: true,
        message: res.message,
      };
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message;
      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetWorkspaces = async () => {
    dispatch(setLoading(true));

    try {
      const res = await getWorkspaces();
      dispatch(setAllWorkspaces(res.workspaces));
      return {
        success: true,
        message: res.message,
      };
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message;
      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditWorkspace = async (workspaceDetail: UpdateWorkspace) => {
    dispatch(setLoading(true))
                
    try {
      const res = await editWorkspace(workspaceDetail)
      dispatch(setUpdatedWorkspace(res.newWorkspace))
      dispatch(setLoading(false))
      return {
        success: true,
        message: res.message
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message
      return {
        success: false,
        message
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    handleCreateWorkspace,
    handleGetWorkspaces,
    handleEditWorkspace
  };
};

export default useWorkspace;
