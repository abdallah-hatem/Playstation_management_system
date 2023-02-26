import Login from "../pages/Login";
import Main from "../pages/Main";
import Stats from "../pages/Receipts";
import SignUp from "../pages/SignUp";

export const authRoutes = [
  {
    path: "/login",
    component: <Login />,
  },
  {
    path: "/signup",
    component: <SignUp />,
  },
];

export const routes = [
  {
    path: "/",
    component: <Main />,
  },
  {
    path: "/receipts",
    component: <Stats />,
  },
  // ...authRoutes,
];
