import "./App.css";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import NavBar from "./components/nav/NavBar.tsx";
import { useEffect, useState } from "react";
import { User } from "./models/user.ts";
import * as ExpensesApi from "./network/expenses_api";
import Home from "./pages/Home.tsx";
import HomeLoggedOut from "./pages/HomeLoggedOut.tsx";
import { Route, Routes, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Categories from "./pages/Categories.tsx";
import Budget from "./pages/Budget.tsx";
import Investment from "./pages/Investment.tsx";
import Friends from "./pages/Friends.tsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      // User found in local storage
      fetchLoggedInUser();
    } else {
      // No user found in local storage, need to log in
      navigate("/");
    }
  }, [location.pathname]); // Trigger effect on pathname change

  async function fetchLoggedInUser() {
    try {
      const user = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      if (location.pathname === "/" || location.pathname === "/home") {
        // If on home page or root, navigate to /home
        navigate("/home");
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    navigate("/");
  }

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLogin(true)}
        onSignUpClicked={() => setShowSignUp(true)}
        onLogoutSuccessful={handleLogout}
      />

      <div>
        <Routes>
          <Route index element={<HomeLoggedOut />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/categories" element={<Categories />}></Route>
          <Route path="/budgets" element={<Budget />}></Route>
          <Route path="/investments" element={<Investment />}></Route>
          <Route path="/friends" element={<Friends />}></Route>
        </Routes>
      </div>

      {showSignUp && (
        <SignUp
          onDismiss={() => setShowSignUp(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            navigate("/home");
            setShowSignUp(false);
          }}
        />
      )}
      {showLogin && (
        <Login
          onDismiss={() => setShowLogin(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            localStorage.setItem("loggedInUser", JSON.stringify(user));
            navigate("/home");
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
