import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Articles } from "../Pages/Articles";
import { Layout } from "../Layout/Layout";
import { AdminPage } from "../Pages/AdminPage";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [ 
            {
                path: "/",
                element: <Home />,
                index: true,
            },
            {
                path: "/admin",
                element: <AdminPage />
            },
            {
                path: "/articles",
                element: <Articles />
            },


        ]
    }

])