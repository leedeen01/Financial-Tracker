import { useState } from "react";
import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface ImageInputFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [x: string]: any;
}

const ImageInputField = ({
  name,
  label,
  register,
  registerOptions,
  error,
  onChange,
  ...props
}: ImageInputFieldProps) => {
    const {
        onChange: registerOnChange,
    } = register(name, registerOptions);

    const [img, setImg] = useState<string>(import.meta.env.VITE_DEFAULT_PIC);

    function convertToBase64(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
            setImg(reader.result as string);
            const hiddenInput = document.getElementById(name + '-hidden') as HTMLInputElement;
            if (hiddenInput) hiddenInput.value = reader.result as string;
            }
        };
        reader.onerror = (error) => {
            console.log("Error: ", error);
        };
        }
    }

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <Form.Control
            type="file"
            accept="image/*"
            {...props}
            {...register(name, registerOptions)}
            onChange={(e) => {
                const event = e as React.ChangeEvent<HTMLInputElement>;
                if (onChange) onChange(event);
                convertToBase64(event);
                registerOnChange(event);
            }}
            isInvalid={!!error}
        />
        <Form.Control.Feedback type="invalid">
            {error?.message}
        </Form.Control.Feedback>
        {img && <img className="profile-pic mb-3 mt-3" src={img} alt="Selected" />}
      </div>
    </Form.Group>
  );
};

export default ImageInputField;