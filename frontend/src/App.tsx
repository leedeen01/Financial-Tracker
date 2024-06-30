import { useEffect, useState } from "react";
import { User } from "./models/user.ts";
import * as ExpensesApi from "./network/expenses_api";
import NavBar from "./components/nav/NavBar.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import Home from "./pages/Home.tsx";
import HomeLoggedOut from "./pages/HomeLoggedOut.tsx";
import Categories from "./pages/Categories.tsx";
import Budget from "./pages/Budget.tsx";
import Investments from "./pages/Investments.tsx";
import Split from "./pages/Split.tsx";
import Friends from "./pages/Friends.tsx";
import { Route, Routes, useNavigate } from "react-router-dom";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await ExpensesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  function handleLogout() {
    setLoggedInUser(null);
    navigate("/");
  }

  function handleLogin(user: User) {
    setLoggedInUser(user);
    navigate("/home");
    setShowLogin(false);
  }

  function handleSignUp(user: User) {
    setLoggedInUser(user);
    navigate("/home");
    setShowSignUp(false);
  }

  return (
    <div>
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLogin(true)}
        onSignUpClicked={() => setShowSignUp(true)}
        onLogoutSuccessful={handleLogout}
      />

      <Routes>
        <Route index element={<HomeLoggedOut />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/categories" element={<Categories />}></Route>
        <Route path="/budgets" element={<Budget />}></Route>
        <Route path="/investments" element={<Investments />}></Route>
        <Route path="/split" element={<Split />}></Route>
        <Route path="/friends" element={<Friends />}></Route>
      </Routes>

      {showSignUp && (
        <SignUp
          onDismiss={() => setShowSignUp(false)}
          onSignUpSuccessful={handleSignUp} // Pass handleSignUp function
        />
      )}
      {showLogin && (
        <Login
          onDismiss={() => setShowLogin(false)}
          onLoginSuccessful={handleLogin} // Pass handleLogin function
        />
      )}
    </div>
  );
}

export default App;
