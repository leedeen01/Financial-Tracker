import { createContext, useEffect, useState } from "react";
import { User } from "./models/user.ts";
import * as ExpensesApi from "./network/expenses_api";
import NavBar from "./components/nav/NavBar.tsx";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import Home from "./pages/Home.tsx";
import HomeLoggedOut from "./pages/HomeLoggedOut.tsx";

import Profile from "./pages/Profile.tsx";
import Friends from "./pages/Friends.tsx";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import Insights from "./pages/Insights.tsx";
import Budgets from "./pages/Budgets.tsx";
import Accounts from "./pages/Accounts.tsx";
import Footer from "./components/footer/footer.tsx";

export const Context = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  async function fetchLoggedInUser() {
    try {
      const user = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(user);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  function handleLogout() {
    setLoggedInUser(null);
    navigate("/");
  }

  function handleLogin(user: User) {
    setLoggedInUser(user);
    navigate("/home");
    setLoading(false);
    setShowLogin(false);
  }

  function handleSignUp(user: User) {
    setLoggedInUser(user);
    navigate("/home");
    setLoading(false);
    setShowSignUp(false);
  }

  return (
    <div>
      <div className="mh">
        <Context.Provider value={[loading, setLoading]}>
          <NavBar
            loggedInUser={loggedInUser}
            onLoginClicked={() => {
              setLoading(false);
              setShowLogin(true);
            }}
            onSignUpClicked={() => {
              setLoading(false);
              setShowSignUp(true);
            }}
            onLogoutSuccessful={handleLogout}
          />

          <Routes>
            <Route
              index
              element={loggedInUser ? <Home /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/home"
              element={loggedInUser ? <Home /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/profile"
              element={loggedInUser ? <Profile /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/friends"
              element={loggedInUser ? <Friends /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/insights"
              element={loggedInUser ? <Insights /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/budgets"
              element={loggedInUser ? <Budgets /> : <HomeLoggedOut />}
            ></Route>
            <Route
              path="/accounts"
              element={loggedInUser ? <Accounts /> : <HomeLoggedOut />}
            ></Route>
            <Route path="*" element={<Navigate to="/" />} />
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
        </Context.Provider>
      </div>
      <Footer />
    </div>
  );
}

export default App;
