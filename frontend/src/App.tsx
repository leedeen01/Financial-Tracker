import "./App.css";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import NavBar from "./components/Nav/NavBar.tsx";
import { useEffect, useState } from "react";
import { User } from "./models/user.ts";
import * as ExpensesApi from "./network/expenses_api";
import Home from "./pages/Home.tsx";
import HomeLoggedOut from "./pages/HomeLoggedOut.tsx";
import { Route, Routes } from "react-router-dom";
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

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await ExpensesApi.getLoggedInUser();
        navigate("/home");
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <div>
      {/* NavBar Section */}
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLogin(true)}
        onSignUpClicked={() => setShowSignUp(true)}
        onLogoutSuccessful={() => {
          navigate("/");
          setLoggedInUser(null);
        }}
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
            navigate("/home");

            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
