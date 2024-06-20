import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField from "../form/TextInputField";

interface SplitBillProps {
  onDismiss: () => void;
}

const SplitBill = ({ onDismiss }: SplitBillProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  async function onSubmit() {
    try {
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>Bill</Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="User"
            label="User"
            type="text"
            placeholder="Username"
            register={register}
            registerOptions={{ required: "Required" }}
          />

          <Button type="submit" disabled={isSubmitting} className="width100">
            Log In
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SplitBill;
