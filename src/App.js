import Navbar from "./Components/Navbar"
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Orders from "./Pages/Orders";
import Cart from "./Pages/Cart";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CustomAuthContext } from "./authContext";
import { CustomProdContext } from "./productContext";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



function App() {
  const router = createBrowserRouter([
    {
      path: "/", element: <Navbar />, children: [
        { index: true, element: <Home /> },
        { path: "/orders", element: <Orders /> },
        { path: "/cart", element: <Cart /> },
        { path: "/signin", element: <SignIn /> },
        { path: "/signup", element: <SignUp /> },
      ],
    },
  ]);
  return (
    <CustomAuthContext>
      <CustomProdContext>
      <div className="App">
        <RouterProvider router={router} />
        <ToastContainer />
      </div>
      </CustomProdContext>
    </CustomAuthContext>

  );
}

export default App;
