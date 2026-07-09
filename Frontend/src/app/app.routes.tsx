import Login from "@/features/auth/pages/Login";
import { createBrowserRouter } from "react-router-dom";

export const routes = createBrowserRouter([
    {
        path: "/",
        // element: <Dashboard />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/workspaces",
        // element: <Workspace />
    },
    {
        path: "/workspaces/:id",
        // element: <WorkspaceList />
    },
    {
        path: "/task/:id",
        // element: <Task />
    },
])