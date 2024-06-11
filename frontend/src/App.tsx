import "./App.css";
import Login from "./components/Login.tsx";
import SignUp from "./components/SignUp.tsx";
import NavBar from "./components/nav/NavBar.tsx";
import { useEffect, useState } from "react";
import { User } from "./models/user.ts";
import * as ExpensesApi from "./network/expenses_api";
import { Container } from "react-bootstrap";
import Home from "./pages/Home.tsx";
import HomeLoggedOut from "./pages/HomeLoggedOut.tsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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

  return (
    <div>
      {/* NavBar Section */}
      <NavBar
        loggedInUser={loggedInUser}
        onLoginClicked={() => setShowLogin(true)}
        onSignUpClicked={() => setShowSignUp(true)}
        onLogoutSuccessful={() => setLoggedInUser(null)}
      />

      <Container>
        <>{loggedInUser ? <Home /> : <HomeLoggedOut />}</>
      </Container>

      {showSignUp && (
        <SignUp
          onDismiss={() => setShowSignUp(false)}
          onSignUpSuccessful={(user) => {
            setLoggedInUser(user);
            setShowSignUp(false);
          }}
        />
      )}
      {showLogin && (
        <Login
          onDismiss={() => setShowLogin(false)}
          onLoginSuccessful={(user) => {
            setLoggedInUser(user);
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
