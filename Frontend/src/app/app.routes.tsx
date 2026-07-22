import Login from "@/features/auth/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import Protected from "./Protected";
import Dashboard from "@/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import Workspaces from "@/features/Workspace/pages/Workspaces";
import SpecificWorkspace from "@/features/workspace/pages/SpecificWorkspace";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Dashboard />
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/workspaces",
        element: <Workspaces />
    },
    {
        path: "/:workspaceId/tasks",
        element: <SpecificWorkspace />
    },
    {
        path: "/task/:id",
        // element: <Task />
    },
    {
        path: "/users",
        element: <Users />
    }
])