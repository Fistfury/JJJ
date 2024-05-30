import { createBrowserRouter } from "react-router-dom";

import { Home } from "../Pages/Home";
import { Admin } from "../Pages/Admin";
import { Articles } from "../Pages/Articles";
import { Layout } from "../Layout/Layout";



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
                element: <Admin />
            },
            {
                path: "/articles",
                element: <Articles />
            },


        ]
    }

])