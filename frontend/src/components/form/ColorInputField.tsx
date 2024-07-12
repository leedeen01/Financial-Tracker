import { useState } from "react";
import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

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



  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <Form.Label>{label}</Form.Label>
        {/* <div className="overflow-x-auto">
          <ButtonGroup className="mb-3">
            {options.map((color) => (
              <Button
                key={color}
                style={{ backgroundColor: color, borderColor: color }}
                onClick={() => handleColorChange(color)}
                className={selectedColor === color ? 'color-button-active' : ''}
              />
            ))}
          </ButtonGroup>
        </div> */}
          <Form.Control
            type="color"
            value={selectedColor}
            {...props}
            {...register(name, registerOptions)}
            onChange={(e) => setSelectedColor(e.target.value)}
            isInvalid={!!error}
          />
      </div>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default ColorInputField;
