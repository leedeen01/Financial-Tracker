import { FriendsExpenseRequestBody } from "../../models/expense";
import { User, currencies } from "../../models/user";
import * as ExpensesApi from "../../network/expenses_api";
import { SetStateAction, useEffect, useState, useContext } from "react";
import PendingPayment from "../../components/friends/PendingPayment";
import { BaseCurrency } from "../../App";

interface FriendListProps {
  loggedInUser: User;
  fetchLoggedInUser: () => void;
}
const FriendList = ({ loggedInUser, fetchLoggedInUser }: FriendListProps) => {
  const [baseC] = useContext(BaseCurrency);
  const [friendDetails, setFriendDetails] = useState<User[]>([]); // Ensure friendDetails is typed as User[]
  const [friendRequestDetails, setFriendRequestDetails] = useState<User[]>([]); // Ensure friendDetails is typed as User[]
  // Function to handle search

  // Function to accept friend request
  const handleAcceptRequest = async (friendId: string) => {
    try {
      await ExpensesApi.acceptFriend(loggedInUser!._id!, friendId);
      console.log(`Friend request from ${friendId} accepted.`);
      fetchLoggedInUser(); // Refresh friend requests after accepting
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  // Function to delete friend request
  const handleDeleteRequest = async (friendId: string) => {
    try {
      await ExpensesApi.deleteRequest(loggedInUser!._id!, friendId);
      console.log(`Friend request from ${friendId} deleted.`);
      fetchLoggedInUser(); // Refresh friend requests after deleting
    } catch (error) {
      console.error("Error deleting friend request:", error);
    }
  };

  const handleDeleteFriend = async (friendId: string) => {
    try {
      await ExpensesApi.deleteFriend(loggedInUser!._id!, friendId);
      console.log("Friend deleted successfully!");
      fetchLoggedInUser(); // Refresh friend list after deleting friend
    } catch (error) {
      console.error("Error deleting friend:", error);
    }
  };

  //used to list friendlist and friend request
  useEffect(() => {
    if (loggedInUser?.friendlist) {
      fetchFriendDetails();
    }

    if (loggedInUser?.friendRequest) {
      fetchFriendRequestDetails();
    }
  }, [loggedInUser]); // Trigger effect when loggedInUser changes

  const fetchFriendDetails = async () => {
    try {
      const promises = loggedInUser!.friendlist.map((friendId) =>
        ExpensesApi.searchUsersById(friendId)
      );
      const friendData = await Promise.all(promises);
      setFriendDetails(friendData);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchFriendRequestDetails = async () => {
    try {
      const promises = loggedInUser!.friendRequest.map((friendId) =>
        ExpensesApi.searchUsersById(friendId)
      );
      const friendData = await Promise.all(promises);
      setFriendRequestDetails(friendData);
    } catch (error) {
      console.error("Error fetching friends request:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("f-list");

  const handleTabClick = (tab: SetStateAction<string>) => {
    setActiveTab(tab);
  };

  const calculateBalance = (friend: User): number => {
    const sentAmount = friend.topay
      .filter(
        (item: FriendsExpenseRequestBody) => item.sendMoney === loggedInUser._id
      )
      .filter((item: FriendsExpenseRequestBody) => item.status === "accepted")
      .map((item: FriendsExpenseRequestBody) => parseInt(item.amount))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const receivedAmount = friend.topay
      .filter(
        (item: FriendsExpenseRequestBody) =>
          item.receiveMoney === loggedInUser._id
      )
      .filter((item: FriendsExpenseRequestBody) => item.status === "accepted")
      .map((item: FriendsExpenseRequestBody) => parseInt(item.amount))
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return sentAmount - receivedAmount;
  };

  return (
    <>
      <div>
        <nav className="nav nav-pills flex-row justify-content-between align-items-center">
          <a
            className={`flex-fill text-center nav-link ${
              activeTab === "f-list" ? "active" : ""
            }`}
            aria-current={activeTab === "f-list" ? "page" : undefined}
            onClick={() => handleTabClick("f-list")}
          >
            Friends List
          </a>
          <a
            className={`flex-fill text-center nav-link ${
              activeTab === "f-req" ? "active" : ""
            }`}
            onClick={() => handleTabClick("f-req")}
          >
            Friend Requests
          </a>
        </nav>
      </div>
      <div>
        {activeTab === "f-list" && (
          <div id="f-list">
            {friendDetails.map((friend) => (
              <div className="col-md-12">
                <div className="card h-md-100">
                  <div className="card-body d-flex flex-row justify-content-between align-items-center">
                    <h6 className="overflow-text mb-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                      </svg>{" "}
                      {friend.username}
                    </h6>

                    <PendingPayment
                      expenseFromFriends={loggedInUser.topay}
                      loggedInUser={loggedInUser}
                      userToPay={friend}
                    />

                    <div className="d-flex flex-column justify-content-between align-items-center w-25">
                      <p className="text-center">
                        {calculateBalance(friend) >= 0
                          ? "They owe you"
                          : "You owe them"}
                        :{" "}
                      </p>
                      <p
                        className={`${
                          calculateBalance(friend) >= 0 ? "they-owe" : "you-owe"
                        }`}
                      >
                        {currencies.symbol[baseC as keyof typeof currencies.symbol] || "$"}{Math.abs(calculateBalance(friend)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteFriend(friend._id!)}
                      className="friend-button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="icon"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                        <rect x="16" y="11" width="6" height="2"></rect>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "f-req" && (
          <div id="f-req">
            {friendRequestDetails.map((request) => (
              <div className="col-md-12">
                <div className="card h-md-100">
                  <div className="card-body d-flex flex-row justify-content-between align-items-center">
                    <h6 className="overflow-text mb-0">{request.username}</h6>
                    <button
                      onClick={() => handleAcceptRequest(request._id!)}
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
                      onClick={() => handleDeleteRequest(request._id!)}
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
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FriendList;
