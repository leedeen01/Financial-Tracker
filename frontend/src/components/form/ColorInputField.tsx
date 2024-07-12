import { Form, Button, ButtonGroup } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { useState, useEffect } from "react";

interface ColorInputFieldProps {
  name: string;
  label: string;
  options: string[];
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  defaultValue?: string;
  [x: string]: any;
}

const ColorInputField = ({
  name,
  label,
  options,
  register,
  registerOptions,
  error,
  defaultValue,
  ...props
}: ColorInputFieldProps) => {
  const [selectedColor, setSelectedColor] = useState(defaultValue || options[0]);

  useEffect(() => {
    setSelectedColor(defaultValue || options[0]); // Reset selected color if defaultValue changes
  }, [defaultValue, options]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    // Update defaultValue of Form.Control to match selected color
    const inputElement = document.getElementById(name + "-input") as HTMLInputElement;
    if (inputElement) {
      inputElement.value = color;
    }
  };

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="color"
          defaultValue={selectedColor} // Use selectedColor as defaultValue
          {...props}
          {...register(name, registerOptions)}
          isInvalid={!!error}
        />
      </div>
      <div className="overflow-x-auto">
        <ButtonGroup className="mb-3">
          {options.map((color) => (
            <Button
              key={color}
              style={{ backgroundColor: color, borderColor: color }}
              onClick={() => handleColorChange(color)}
              className={selectedColor === color ? 'color-button-active' : ''}
            >
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default ColorInputField;
