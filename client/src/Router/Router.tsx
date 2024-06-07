import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {Home} from '../Pages/Home';
import {Layout} from '../Layout/Layout';
import {AdminPage} from '../Pages/AdminPage';
import {Account} from '../Pages/Account';
import {CustomerLoginWrapper} from '../Contexts/CustomerLoginWrapper';
import { useAuth } from '../Contexts/AuthContext';
import { CustomerRegisterWrapper } from '../Contexts/CustomerRegisterWrapper';


export const RouterWrapper = () => {
    const { isAuthenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '/', element: <Home />, index: true },
        { path: '/admin', element: isAuthenticated ? <AdminPage /> : <CustomerLoginWrapper /> },
        { path: '/account', element: isAuthenticated ? <Account /> : <CustomerLoginWrapper /> },
        { path: '/login', element: <CustomerLoginWrapper /> },
        { path: '/register', element: <CustomerRegisterWrapper /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

  

