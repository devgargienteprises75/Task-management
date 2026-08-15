import Login from "@/features/auth/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import Protected from "./Protected";
// import Dashboard from "@/pages/Dashboard";
import Users from "@/features/admin/pages/Users";
import Workspaces from "@/features/workspace/pages/Workspaces";
import SpecificWorkspace from "@/features/workspace/pages/SpecificWorkspace";
import Tasks from "@/features/task/pages/Tasks";
import AccountSetting from "@/pages/AccountSetting";
import Dashboard from "@/pages/Dashboard";

export const routes = createBrowserRouter([
    {
        path: "/",
        element: <Protected>
            <Tasks />
        </Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/workspaces",
        element: <Protected>
            <Workspaces />
        </Protected>
    },
    {
        path: "/workspaces/:workspaceId",
        element: <Protected>
            <SpecificWorkspace />
        </Protected>
    },
    // {
    //     path: "/tasks",
    //     element: <Protected>
    //         <Tasks />
    //     </Protected>
    // },
    {
        path: "/users",
        element: <Protected>
            <Users />
        </Protected>
    },
    {
        path: "/account-setting",
        element: <Protected>
            <AccountSetting />
        </Protected>
    },
    {
        path: "/dashboard",
        element: <Dashboard />
    }
])