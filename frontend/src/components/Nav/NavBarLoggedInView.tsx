import { User } from "../../models/user";
import { Navbar, Button } from "react-bootstrap";
import * as ExpensesApi from "../../network/expenses_api";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <>
      <Navbar.Text className="mx-auto">Welcome, {user.username}</Navbar.Text>
      <Button onClick={() => navigate("/categories")}> Categories</Button>
      <Button onClick={() => navigate("/budgets")}>Budgets</Button>
      <Button onClick={() => navigate("/investments")}>Investments</Button>
      <Button onClick={() => navigate("/friends")}>Friends</Button>
      <Button onClick={logout}>Log Out</Button>
    </>
  );
};

export default NavBarLoggedInView;
