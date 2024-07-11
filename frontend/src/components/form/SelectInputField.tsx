import { Form } from "react-bootstrap";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectInputFieldProps {
  name: string;
  label: string;
  options: string[];
  register: UseFormRegister<any>;
  registerOptions?: RegisterOptions;
  error?: FieldError;
  onChange?: (value: string) => void;
  [x: string]: any;
}

const SelectInputField = ({
  name,
  label,
  options,
  register,
  registerOptions,
  error,
  onChange,
  ...props
}: SelectInputFieldProps) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <Form.Group className="mb-3" controlId={name + "-input"}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        {...props}
        {...register(name, registerOptions)}
        // @ts-ignore
        onChange={handleSelectChange}
        // @ts-ignore
        isInvalid={!!error}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Form.Control>
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default SelectInputField;