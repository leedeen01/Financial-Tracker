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
        <Nav.Link className="mx-auto" as={Link} to="/home">
          Dashboard
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/accounts">
          Accounts
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/budgets">
          Categories
        </Nav.Link>
        {/* <Nav.Link className="mx-auto" as={Link} to="/insights">
          Insights
        </Nav.Link> */}
        <Nav.Link className="mx-auto" as={Link} to="/friends">
          Friends
        </Nav.Link>
        <Nav.Link className="mx-auto" as={Link} to="/profile">
          {user.username}'s Profile
        </Nav.Link>
        <Nav.Link disabled={true} className="mx-auto">
          <img src={user.picture ? user.picture : import.meta.env.VITE_DEFAULT_PIC} alt="" className={`profile-pic-nav ${user.verified ? 'verified-border' : ''}`} />
        </Nav.Link>
      </Nav>
      <Button onClick={logout}>Log Out</Button>
    </>
  );
};

export default NavBarLoggedInView;
