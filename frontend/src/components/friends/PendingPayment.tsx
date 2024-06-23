import { useEffect, useState } from "react";
import { FriendsExpenseRequestBody } from "../../models/expense";
import * as ExpensesApi from "../../network/expenses_api";
import { User } from "../../models/user";

interface PendingPaymentProps {
  expenseFromFriends: FriendsExpenseRequestBody[];
  loggedInUser: User;
}

const PendingPayment = ({
  expenseFromFriends,
  loggedInUser,
}: PendingPaymentProps) => {
  const [friendExpenseRequest, setFriendExpenseRequest] = useState<
    FriendsExpenseRequestBody[]
  >([]);

  const fetchFriendExpenseRequest = async () => {
    try {
      const promises = expenseFromFriends
        .filter((item) => item.status === "pending")
        .map(async (expense: FriendsExpenseRequestBody) => {
          const receive = await ExpensesApi.searchUsersById(
            expense.receiveMoney
          );
          const send = await ExpensesApi.searchUsersById(expense.sendMoney);

          expense.sendMoney = send.username; // Update the sendMoney property with the fetched result
          expense.receiveMoney = receive.username; // Update the receiveMoney property with the fetched result

          return expense; // Return the updated expense object
        });

      // Wait for all promises to resolve
      const updatedExpenses = await Promise.all(promises);

      // Update state with the updated expenses
      setFriendExpenseRequest(updatedExpenses);
    } catch (error) {
      console.error("Error fetching friend expenses:", error);
    }
  };

  useEffect(() => {
    fetchFriendExpenseRequest();
  }, [expenseFromFriends]); // Fetch expenses whenever expenseFromFriends changes

  return (
    <div>
      <h1>Pending Payment</h1>
      <ul>
        {friendExpenseRequest.map((expense, index) => (
          <li key={index}>
            {expense.sendMoney === loggedInUser.username ? (
              <>
                <div>Expense Name: {expense.receiveMoney}</div>
                <div>Description: {expense.description}</div>
                <div>Date: {expense.date.toString()}</div>
                <div>Amount: {expense.amount}</div>
              </>
            ) : (
              <>
                <div>Expense Name: {expense.sendMoney}</div>
                <div>Description: {expense.description}</div>
                <div>Date: {expense.date.toString()}</div>
                <div>Amount: {expense.amount}</div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingPayment;
