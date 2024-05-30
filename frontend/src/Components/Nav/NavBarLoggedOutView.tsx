import { User } from "../../models/user";
import { Navbar, Button } from "react-bootstrap";
import * as ExpensesApi from "../../network/expenses_api";

interface NavBarLoggedOutViewProps {
    onSignUpClicked: () => void,
    onLoginClicked: () => void,
}

const NavBarLoggedOutView = ({onSignUpClicked, onLoginClicked}: NavBarLoggedOutViewProps) => {    
    return (
        <>
            <Button onClick={onSignUpClicked}>
                Sign Up
            </Button>
            <Button onClick={onLoginClicked}>
                Log In
            </Button>
        </>
    );
}

export default NavBarLoggedOutView;