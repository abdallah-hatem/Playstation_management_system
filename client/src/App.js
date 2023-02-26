import { useContext, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { authRoutes, routes } from "./Routes/Routes";
import NavBar from "./layout/NavBar";
import "./App.css";

function App() {
  let navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const location = useLocation();

  const [currentRoute, setCurrentRoute] = useState("");

  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  useEffect(() => {
    // if user is logged in and tried to access any random route redirect to main page
    if (
      isLoggedIn() &&
      !routes.filter((el) => el.path === currentRoute).length > 0
    ) {
      navigate("/");
    }

    // if user is not logged in and tried to access non-auth routes redirect to login page
    if (
      !isLoggedIn() &&
      !authRoutes.filter((el) => el.path === currentRoute).length > 0
    ) {
      navigate("/login");
    }
  }, [currentRoute]);

  return (
    <>
      <NavBar />
      <div className="main">
        <Routes>
          {isLoggedIn()
            ? routes.map((el) => (
                <Route path={el.path} element={el.component} />
              ))
            : authRoutes.map((el) => (
                <Route path={el.path} element={el.component} />
              ))}
        </Routes>
      </div>
    </>
  );
}

export default App;
