import { createBrowserRouter } from "react-router-dom";
import { Home } from "../Pages/Home";
import { Layout } from "../Layout/Layout";
import { AdminPage } from "../Pages/AdminPage";
import { PaymentSuccess } from "../Pages/PaymentSuccess";
import { PaymentFailed } from "../Pages/PaymentFailed";



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
                path: "/payment-success",
                element: <PaymentSuccess />
            },
            {
                path: "/payment-failed",
                element: <PaymentFailed />
            },


        ]
    }

])