import React, { useEffect, useState } from "react";
import { FriendsExpenseRequestBody } from "../../models/expense";
import * as ExpensesApi from "../../network/expenses_api";
import { User } from "../../models/user";

interface AcceptedPaymentProps {
  expenseFromFriends: FriendsExpenseRequestBody[];
  loggedInUser: User;
}

const AcceptedPayment: React.FC<AcceptedPaymentProps> = ({
  expenseFromFriends,
  loggedInUser,
}: AcceptedPaymentProps) => {
  const [friendExpenseRequest, setFriendExpenseRequest] = useState<
    FriendsExpenseRequestBody[]
  >([]);

  const fetchFriendExpenseRequest = async () => {
    try {
      const promises = expenseFromFriends
        .filter((item) => item.status === "accepted")
        .map(async (expense: FriendsExpenseRequestBody) => {
          try {
            const receive = await ExpensesApi.searchUsersById(
              expense.receiveMoney
            );
            const send = await ExpensesApi.searchUsersById(expense.sendMoney);

            expense.sendMoney = send.username; // Update the sendMoney property with the fetched result
            expense.receiveMoney = receive.username; // Update the receiveMoney property with the fetched result

            return expense; // Return the updated expense object
          } catch (error) {
            console.error("Error fetching user details:", error);
            throw error; // Rethrow the error to stop processing and handle it in Promise.all
          }
        });

      // Wait for all promises to resolve
      const updatedExpenses = await Promise.all(promises);

      // Update state with the updated expenses
      setFriendExpenseRequest(updatedExpenses);
    } catch (error) {
      console.error("Error fetching friend expenses:", error);
      // Optionally, handle errors or show error message to user
    }
  };

  useEffect(() => {
    fetchFriendExpenseRequest();
  }, [expenseFromFriends]); // Fetch expenses whenever expenseFromFriends changes

  return (
    <div>
      <h1>Accepted Payment</h1>
      <ul>
        {friendExpenseRequest.map((expense, index) => (
          <li key={index}>
            {expense.sendMoney === loggedInUser.username ? (
              <>
                <div>Name: {expense.receiveMoney}</div>
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

export default AcceptedPayment;
