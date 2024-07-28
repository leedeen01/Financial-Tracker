import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { User, currencies } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import { SignUpCredentials } from "../network/expenses_api";
import TextInputField from "./form/TextInputField";
import { ChangeEvent, useContext, useState } from "react";
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
  const [img, setImg] = useState<string>(import.meta.env.VITE_DEFAULT_PIC);
  const [, setBaseC] = useContext(BaseCurrency);
  const [displayC, setDisplayC] = useState<string>("");

  async function onSubmit(credentials: SignUpCredentials) {
    try {
      setLoading(true);
      credentials.picture = img;
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

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File = e.target.files![0]; // Ensure it's a File object or null
    if (file) {
      convertToBase64(file).then((base64) => {
        setImg(base64);
      });
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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
                <div style={{ fontSize: "40px" }}>
                  {currencies.emoji[
                    displayC as keyof typeof currencies.emoji
                  ] || "🇸🇬"}
                </div>
              </div>

              <div className="d-flex flex-column gap-2">
                <label htmlFor="file-upload">Profile Picture</label>
                <input
                  type="file"
                  name="myFile"
                  id="file-upload"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFileUpload(e)
                  }
                />
                {img && (
                  <img
                    className="profile-pic mb-3 mt-3 mx-auto"
                    src={img}
                    alt="Selected"
                  />
                )}
              </div>

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
