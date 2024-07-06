import { User } from "../../models/user";
import { Button } from "react-bootstrap";
import * as ExpensesApi from "../../network/expenses_api";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}

const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      await ExpensesApi.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <>
      <Nav className="mx-auto">
        {/* <Nav.Link className="mx-auto" as={Link} to="/categories">
          Categories
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/budgets">
          Budgets
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/investments">
          Investments
        </Nav.Link> */}
        <Nav.Link className="mx-auto" as={Link} to="/home">
          {user.username}'s Dashboard
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/friends">
          Friends
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/split">
          Split
        </Nav.Link>
      </Nav>
      <Button onClick={logout}>Log Out</Button>
    </>
  );
};

export default NavBarLoggedInView;
