import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainContent from "./mainContent";
import ErrorPage from "./components/errorPage";
import Index from "./components";
import Login from "./components/login";
import Logout from "./components/logout";
import Categories from "./components/categories";
import Articles from "./components/articles";
import Users from "./components/users";
import Settings from "./components/settings";
import AddCategory from "./components/addCategory";
import RemoveCategory from "./components/removeCategory";

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
                  },   
                  {
                    path: '/categories',
                    element: <Categories />,
                  },
                  {
                    path: '/categories/add',
                    element: <AddCategory type='add' />,
                  },  
                  {
                    path: '/categories/edit/:id',
                    element: <AddCategory type='edit' />,
                  },   
                  {
                    path: '/categories/delete/:id',
                    element: <RemoveCategory />,
                  },  
                  {
                    path: '/articles',
                    element: <Articles />
                  },   
                  {
                    path: '/users',
                    element: <Users />
                  },   
                  {
                    path: '/settings',
                    element: <Settings />
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