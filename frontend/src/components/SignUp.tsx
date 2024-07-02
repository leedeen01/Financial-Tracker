import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import { SignUpCredentials } from "../network/expenses_api";
import TextInputField from "./form/TextInputField";
import { useState } from "react";
import Loader from "./loader/Loader";

interface SignUpModalProps {
    onDismiss: () => void,
    onSignUpSuccessful: (user: User) => void,
}

const SignUp = ({onDismiss, onSignUpSuccessful}: SignUpModalProps) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpCredentials>();

    const [loading, setLoading] = useState(false);

    async function onSubmit(credentials: SignUpCredentials) {
        try {
            setLoading(true);
            const newUser = await ExpensesApi.signUp(credentials);
            setLoading(false);
            onSignUpSuccessful(newUser);
        } catch (error) {
            setLoading(false);
            alert(error);
            console.error(error);
        }
    }

    return (
        <>
        {loading ? (
            <Modal show onHide={onDismiss}>
                <Modal.Header closeButton>
                    Sign Up
                </Modal.Header>

                <Modal.Body>
                    <Loader />
                </Modal.Body>
            </Modal>
        ) : (
            <Modal show onHide={onDismiss}>
                <Modal.Header closeButton>
                    Sign Up
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
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="Email"
                            register={register}
                            registerOptions={{ required: "Required" }}
                            error={errors.email}
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
                            Sign Up
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        )}
        </>
    );
}

export default SignUp;