import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { FriendsExpenseRequestBody } from "../../models/expense";
import * as ExpensesApi from "../../network/expenses_api";
import { User } from "../../models/user";
import { Modal, Button } from "react-bootstrap";

interface PendingPaymentProps {
  expenseFromFriends: FriendsExpenseRequestBody[];
  loggedInUser: User;
  userToPay: User;
}

const PendingPayment = ({
  expenseFromFriends,
  loggedInUser,
  userToPay,
}: PendingPaymentProps) => {
  const [friendExpenseRequest, setFriendExpenseRequest] = useState<
    FriendsExpenseRequestBody[]
  >([]);

  const fetchFriendExpenseRequest = async () => {
    try {
      const promises = expenseFromFriends.filter(
        (item) => item.status === "pending"
      );

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
      sendMoneyName: expense.sendMoneyName,
      receiveMoneyName: expense.receiveMoneyName,
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
      sendMoneyName: expense.sendMoneyName,
      receiveMoneyName: expense.receiveMoneyName,
      description: expense.description,
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
    });
  };

  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
  };

  const clearOwed = async (userId: string) => {
    await ExpensesApi.settleExpenseRequest(userId);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const pendingCount = friendExpenseRequest
    .filter((expense) => expense.status === "pending")
    .filter(
      (expense) =>
        expense.receiveMoneyName === userToPay.username ||
        expense.sendMoneyName === userToPay.username
    ).length;

  return (
    <>
      <button className="pending-btn" onClick={handleButtonClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          height="16"
          className="icon"
        >
          <path d="M256 0C114.62 0 0 114.6 0 256s114.62 256 256 256 256-114.6 256-256S397.38 0 256 0zm0 472c-119.4 0-216-96.6-216-216S136.6 40 256 40s216 96.6 216 216-96.6 216-216 216z" />
          <path d="M360.52 303.98l-84.58-84.6V112c0-8.84-7.16-16-16-16s-16 7.16-16 16v120c0 4.24 1.68 8.32 4.69 11.31l88.58 88.6c6.25 6.26 16.38 6.26 22.62 0 6.25-6.26 6.25-16.38 0-22.63z" />
        </svg>
        {pendingCount > 0 && (
          <span className="pending-count">{pendingCount}</span>
        )}
      </button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pending payments for {userToPay.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {friendExpenseRequest
              .filter((expense) => expense.status === "pending")
              .filter(
                (expense) =>
                  expense.receiveMoneyName === userToPay.username ||
                  expense.sendMoneyName === userToPay.username
              )
              .map((expense) => (
                <div className="row align-items-center justify-content-center">
                  {expense.sendMoneyName === loggedInUser.username ? (
                    <>
                      <div className="col-md-12">
                        <div className="card h-md-100">
                          <div className="card-header pending-send">
                            <h6 className="overflow-text mb-0">
                              {expense.description}
                            </h6>
                          </div>
                          <div className="card-body d-flex flex-row justify-content-between align-items-center">
                            <p>
                              To Pay: ${parseFloat(expense.amount).toFixed(2)}
                            </p>
                            <div>
                              <button
                                onClick={() =>
                                  acceptFriendExpenseRequest(
                                    expense.receiveMoney,
                                    expense
                                  )
                                }
                                className="friend-button friend-button-accept"
                              >
                                <svg
                                  viewBox="0 0 16 16"
                                  height="16"
                                  width="16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M13.485 3.515a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-3.25-3.25a.75.75 0 1 1 1.06-1.06L6 10.439l6.97-6.97a.75.75 0 0 1 1.06 0z"
                                  ></path>
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  declineFriendExpenseRequest(
                                    expense.receiveMoney,
                                    expense
                                  )
                                }
                                className="friend-button friend-button-reject"
                              >
                                <svg
                                  viewBox="0 0 16 16"
                                  height="16"
                                  width="16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="icon"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3.707 3.293a1 1 0 0 1 1.414 0L8 6.172l2.879-2.879a1 1 0 1 1 1.414 1.414L9.414 8l2.879 2.879a1 1 0 1 1-1.414 1.414L8 9.414l-2.879 2.879a1 1 0 0 1-1.414-1.414L6.586 8 3.707 5.121a1 1 0 0 1 0-1.414z"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-12">
                        <div className="card h-md-10">
                          <div className="card-header pending-receive">
                            <h6 className="overflow-text mb-0">
                              {expense.description}
                            </h6>
                          </div>
                          <div className="card-body d-flex flex-row justify-content-between align-items-center">
                            <p>
                              To Receive: $
                              {parseFloat(expense.amount).toFixed(2)}
                            </p>
                            <h6>Request Sent</h6>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary"
            onClick={() => clearOwed(userToPay!._id!)}
          >
            Settle Payment
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PendingPayment;
