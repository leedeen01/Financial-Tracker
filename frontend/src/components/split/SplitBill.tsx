import "bootstrap/dist/css/bootstrap.css";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import TextInputField from "../form/TextInputField";
import { User } from "../../models/user";
import { FriendsExpenseRequestBody } from "../../models/expense";
import { Category } from "../../models/category";
import * as ExpensesApi from "../../network/expenses_api";
import DatePicker from "react-datepicker";

interface SplitExpense {
  description: string;
  category: string;
  date: Date;
  amounts: Record<string, number>;
}

interface SplitBillProps {
  onDismiss: () => void;
  loggedInUser: User;
  userToSplit: User[];
  categories: Category[];
}

const SplitBill = ({
  onDismiss,
  loggedInUser,
  userToSplit,
  categories,
}: SplitBillProps) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SplitExpense>();

  const onSubmit = async (formData: SplitExpense) => {
    try {
      const { description, category, date, amounts } = formData;
      onDismiss();
      const billSplitData = {
        description,
        category,
        date,
        amounts,
        payer: loggedInUser._id, // Example: Assuming loggedInUser has an _id property
      };

      alert("Successfully sent a bill split request.");

      // Example: Sending each user's share as an expense
      const expensePromises = Object.entries(amounts).map(
        async ([userId, amount]) => {
          const user = userToSplit.find((u) => u._id === userId);
          if (user) {
            const receive = await ExpensesApi.searchUsersById(userId);
            const send = await ExpensesApi.searchUsersById(loggedInUser._id!);
            const expense: FriendsExpenseRequestBody = {
              description,
              category,
              date,
              amount: amount.toString(),
              sendMoneyName: send.username,
              receiveMoneyName: receive.username,
              sendMoney: loggedInUser._id!,
              receiveMoney: userId,
              status: "pending",
            };
            await ExpensesApi.sendFriendExpense(user!._id!, expense);
            console.log(`Expense created for ${user.username}:`, expense);
          }
        }
      );

      // Wait for all expense creation promises to resolve
      await Promise.all(expensePromises);

      // Optionally, perform any additional actions after submitting the bill split
    } catch (error) {
      console.error("Error submitting bill split:", error);
      alert("Failed to split bill. Please try again."); // Example: Notify user of failure
    }
  };

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>Bill</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="description"
            label="Description"
            type="text"
            placeholder="Enter description"
            register={register}
          />
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-control"
            >
              <option value=""></option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  placeholderText="Select date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value}
                  dateFormat="dd/MM/yyyy" // Example date format
                />
              )}
            />
          </div>
          {userToSplit.map((user) => (
            <TextInputField
              key={user._id}
              name={`amounts.${user._id}`}
              label={`${user.username} to pay`}
              type="number"
              step="0.01"
              placeholder={`Enter amount for ${user.username}`}
              register={register}
            />
          ))}
          <Button type="submit" disabled={isSubmitting} className="width100">
            Split Bill
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SplitBill;
