import React, { useEffect, useState, useContext } from "react";
import { FriendsExpenseRequestBody } from "../../models/expense";
import * as ExpensesApi from "../../network/expenses_api";
import { User, currencies } from "../../models/user";
import { BaseCurrency } from "../../App";

interface DeclinedPaymentProps {
  expenseFromFriends: FriendsExpenseRequestBody[];
  loggedInUser: User;
  userToPay: string;
}

const DeclinedPayment: React.FC<DeclinedPaymentProps> = ({
  expenseFromFriends,
  loggedInUser,
  userToPay,
}: DeclinedPaymentProps) => {
  const [baseC] = useContext(BaseCurrency);

  const [friendExpenseRequest, setFriendExpenseRequest] = useState<
    FriendsExpenseRequestBody[]
  >([]);

  const fetchFriendExpenseRequest = async () => {
    try {
      const promises = expenseFromFriends
        .filter((item) => item.status === "declined")
        .filter((item) => item.sendMoneyName === userToPay || item.receiveMoneyName === userToPay)
        .map(async (expense: FriendsExpenseRequestBody) => {
          try {
            const receive = await ExpensesApi.searchUsersById(
              expense.receiveMoney
            );
            const send = await ExpensesApi.searchUsersById(expense.sendMoney);

            expense.sendMoneyName = send.username; // Update the sendMoney property with the fetched result
            expense.receiveMoneyName = receive.username; // Update the receiveMoney property with the fetched result

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
    <>
      <div className="col-md-12 mt-3">
        <div className="h-md-100">
          <div className="d-flex flex-column justify-content-end table-responsive">
            <table className="table table-bordered table-striped text-center">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="hide-header">Date</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {friendExpenseRequest.map((expense, index) => {
                  const date = new Date(expense.date);
                  const formattedDate = `${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date
                    .getFullYear()
                    .toString()
                    .slice(2)}`;
                  return (
                    <tr key={index}>
                      {expense.sendMoneyName === loggedInUser.username ? (
                        <>
                          <td>{expense.receiveMoneyName}</td>
                          <td>{expense.description}</td>
                          <td className="hide-cell">{formattedDate}</td>
                          <td>{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </>
                      ) : (
                        <>
                          <td>{expense.sendMoneyName}</td>
                          <td>{expense.description}</td>
                          <td className="hide-cell">{formattedDate}</td>
                          <td>{currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeclinedPayment;
