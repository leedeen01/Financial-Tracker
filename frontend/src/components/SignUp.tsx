import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User, currencies } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import { SignUpCredentials } from "../network/expenses_api";
import TextInputField from "./form/TextInputField";
import { useContext, useState } from "react";
import { Context } from "../App";
import Loader from "./loader/Loader";
//import ImageInputField from "./form/ImageInputField";
import SelectInputField from "./form/SelectInputField";
import { BaseCurrency } from "../App";

interface SignUpModalProps {
  onDismiss: () => void;
  onSignUpSuccessful: (user: User) => void;
}

const SignUp = ({ onDismiss, onSignUpSuccessful }: SignUpModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpCredentials>();

  const [loading, setLoading] = useContext(Context);
//  const [img, setImg] = useState<string>(import.meta.env.VITE_DEFAULT_PIC);
  const [, setBaseC] = useContext(BaseCurrency);
  const [displayC, setDisplayC] = useState<string>("");

  // function convertToBase64(event: React.ChangeEvent<HTMLInputElement>) {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       if (reader.result) {
  //         setImg(reader.result as string);
  //       }
  //     };
  //     reader.onerror = (error) => {
  //       console.log("Error: ", error);
  //     };
  //   }
  // }

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      setLoading(true);
      // credentials.picture = img;
      const newUser = await ExpensesApi.signUp(credentials);
      setBaseC(credentials.currency);
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
          <Modal.Header closeButton>Sign Up</Modal.Header>

          <Modal.Body>
            <Loader />
          </Modal.Body>
        </Modal>
      ) : (
        <Modal show onHide={onDismiss}>
          <Modal.Header closeButton>Sign Up</Modal.Header>

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

              <div className="d-flex flex-row justify-content-between align-items-center">
                <SelectInputField
                  name="currency"
                  label="Base Currency"
                  options={["SGD", "USD", "EUR", "GBP", "JPY", "CNY", "KRW"]}
                  register={register}
                  onChange={(event) => setDisplayC(event)}
                  registerOptions={{ required: "Required" }}
                  error={errors.currency}
                />
                <div style={{fontSize: "40px"}}>{currencies.emoji[displayC as keyof typeof currencies.emoji] || "🇸🇬"}</div>
              </div>

              {/* <ImageInputField
                name="picture"
                label="Profile Picture"
                onChange={convertToBase64}
                register={register}
                registerOptions={{}}
                error={errors.picture}
              /> */}

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
};

export default SignUp;
