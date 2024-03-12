import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainContent from "./mainContent";
import ErrorPage from "./components/errorPage";
import Index from "./components";
import Login from "./components/login";
import Logout from "./components/logout";

const Router = () => {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <MainContent />,
        errorElement: <ErrorPage />,
        children: [
          {
              errorElement: <ErrorPage />,
              children: [
                  {index: true, element: <Index />},     
                  {
                    path: '/logout',
                    element: <Logout />
                  }            
              ]
          }
        ]
      },
      {
        path: "/login",
        element: <Login />
      }
    ]);
  
    return <RouterProvider router={router} />;
  };
  
  export default Router;