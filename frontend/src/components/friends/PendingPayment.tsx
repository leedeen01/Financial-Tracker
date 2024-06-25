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

          expense.sendMoneyName = send.username; // Update the sendMoney property with the fetched result
          expense.receiveMoneyName = receive.username; // Update the receiveMoney property with the fetched result

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

  const acceptFriendExpenseRequest = async (
    userId: string,
    expense: FriendsExpenseRequestBody
  ) => {
    ExpensesApi.acceptExpenseRequest(userId, {
      status: expense.status,
      sendMoney: expense.sendMoney,
      receiveMoney: expense.receiveMoney,
      description: expense.description,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
    });
  };
  const declineFriendExpenseRequest = async (
    userId: string,
    expense: FriendsExpenseRequestBody
  ) => {
    ExpensesApi.declineExpenseRequest(userId, {
      status: expense.status,
      sendMoney: expense.sendMoney,
      receiveMoney: expense.receiveMoney,
      description: expense.description,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
    });
  };

  return (
    <div>
      <h1>Pending Payment</h1>
      <ul>
        {friendExpenseRequest.map((expense, index) => (
          <li key={index}>
            {expense.sendMoneyName === loggedInUser.username ? (
              <>
                <div>Username: {expense.receiveMoneyName}</div>
                <div>Description: {expense.description}</div>
                <div>Amount: {expense.amount}</div>
                <button
                  onClick={() =>
                    acceptFriendExpenseRequest(expense.receiveMoney, expense)
                  }
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    declineFriendExpenseRequest(expense.receiveMoney, expense)
                  }
                >
                  Decline
                </button>
              </>
            ) : (
              <>
                <div>Username: {expense.sendMoneyName}</div>
                <div>Description: {expense.description}</div>
                <div>Amount: {expense.amount}</div>
                <h5>Request Sent</h5>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingPayment;
