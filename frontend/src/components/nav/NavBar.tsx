import "../../App.css";
import Logo from "../../assets/logo.png";

import { Container, Navbar, Nav } from "react-bootstrap";
import { User, currencies } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link } from "react-router-dom";
import { BaseCurrency } from "../../App";
import { useContext } from "react";

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}

const NavBar = ({
  loggedInUser,
  onSignUpClicked,
  onLoginClicked,
  onLogoutSuccessful,
}: NavBarProps) => {
  const [baseC] = useContext(BaseCurrency);

  return (
    <Navbar variant="dark" expand="lg" sticky="top" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to={loggedInUser ? "/home" : "/"} className="d-flex gap-3">
          <div className="navbar-logo-container">
            <img src={Logo} alt="Trackspence Logo" className="navbar-logo" />
            <h2 className="navbar-text-logo">Trackspence</h2>
          </div>
          <div className="ml-3">{currencies.emoji[baseC as keyof typeof currencies.emoji] || ""}</div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavBarLoggedInView
                user={loggedInUser}
                onLogoutSuccessful={onLogoutSuccessful}
              />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
