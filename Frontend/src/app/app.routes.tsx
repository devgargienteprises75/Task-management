import Login from "@/features/auth/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import Protected from "./Protected";
import Dashboard from "@/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import Workspaces from "@/features/workspace/pages/Workspaces";

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
        path: "/workspaces/:id",
        // element: <WorkspaceList />
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