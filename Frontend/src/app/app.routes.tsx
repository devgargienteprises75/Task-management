import Login from "@/features/auth/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import Protected from "./Protected";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            {/* <Dashboard /> */}
        </Protected>
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