import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import { LoginCredentials } from "../network/expenses_api";
import TextInputField from "./form/TextInputField";

interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

const Login = ({onDismiss, onLoginSuccessful}: LoginModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await ExpensesApi.login(credentials);
            onLoginSuccessful(user);
        } catch (error) {
            alert(error);
            console.error(error);
        }
    }

    return (
        <Modal show onHide={onDismiss}>
            <Modal.Header closeButton>
                Log In
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />

                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="width100"
                    >
                        Log In
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default Login;