import "bootstrap/dist/css/bootstrap.css";
import { SetStateAction, useEffect, useState, useContext } from "react";
import { FriendsExpenseRequestBody } from "../../models/expense";
import * as ExpensesApi from "../../network/expenses_api";
import { User, currencies } from "../../models/user";
import { Modal, Button } from "react-bootstrap";
import AcceptedPayment from "./AcceptedPayment";
import DeclinedPayment from "./DeclinedPayment";
import { BaseCurrency } from "../../App";

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
  const [baseC] = useContext(BaseCurrency);

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
    alert("All payments successfully cleared.");
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

  const [activeTab, setActiveTab] = useState("pp");

  const handleTabClick = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <>
      <button className="pending-btn" onClick={handleButtonClick}>
        <i className="fa fa-dollar icon"></i>
        {pendingCount > 0 && (
          <span className="pending-count">{pendingCount}</span>
        )}
      </button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Payments for {userToPay.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <nav className="nav nav-pills flex-row justify-content-between align-items-center">
              <a
                className={`flex-fill text-center nav-link ${
                  activeTab === "pp" ? "active" : ""
                }`}
                aria-current={activeTab === "pp" ? "page" : undefined}
                onClick={() => handleTabClick("pp")}
              >
                Pending
              </a>
              <a
                className={`flex-fill text-center nav-link ${
                  activeTab === "ap" ? "active" : ""
                }`}
                onClick={() => handleTabClick("ap")}
              >
                Accepted
              </a>
              <a
                className={`flex-fill text-center nav-link ${
                  activeTab === "dp" ? "active" : ""
                }`}
                onClick={() => handleTabClick("dp")}
              >
                Declined
              </a>
            </nav>
          </div>
          <div>
            {activeTab === "pp" && (
              <div id="pp" className="mt-3">
                {friendExpenseRequest
                  .filter((expense) => expense.status === "pending")
                  .filter(
                    (expense) =>
                      expense.receiveMoneyName === userToPay.username ||
                      expense.sendMoneyName === userToPay.username
                  )
                  .map((expense) => (
                    <div className="row align-items-center justify-content-center mt-3">
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
                                  To Pay: {currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}
                                  {parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                  To Receive: {currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}
                                  {parseFloat(expense.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            )}

            {activeTab === "ap" && (
              <div id="ap">
                <AcceptedPayment
                  expenseFromFriends={loggedInUser.topay}
                  loggedInUser={loggedInUser}
                />
              </div>
            )}

            {activeTab === "dp" && (
              <div id="dp">
                <DeclinedPayment
                  expenseFromFriends={loggedInUser.topay}
                  loggedInUser={loggedInUser}
                />
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => clearOwed(userToPay!._id!)}>
            Settle Payments
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
