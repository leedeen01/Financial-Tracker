import { User } from "../../models/user";
import { Navbar, Button } from "react-bootstrap";
import * as ExpensesApi from "../../network/expenses_api";

interface NavBarLoggedInViewProps {
    user: User,
    onLogoutSuccessful: () => void,
}

const NavBarLoggedInView = ({user, onLogoutSuccessful}: NavBarLoggedInViewProps) => {
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
            <Navbar.Text className="me-2">
                Signed in as: {user.username}
            </Navbar.Text>
            <Button onClick={logout}>
                Log Out
            </Button>
        </>
    );
}

export default NavBarLoggedInView;