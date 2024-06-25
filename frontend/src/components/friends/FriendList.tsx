import { FriendsExpenseRequestBody } from "../../models/expense";
import { User } from "../../models/user";
import * as ExpensesApi from "../../network/expenses_api";
import { useEffect, useState } from "react";

interface FriendListProps {
  loggedInUser: User;
  fetchLoggedInUser: () => void;
}
const FriendList = ({ loggedInUser, fetchLoggedInUser }: FriendListProps) => {
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
  return (
    <>
      <div>
        <div>
          <h2>Friend List:</h2>
          <ul>
            {friendDetails.map((friend, index) => (
              <li key={index}>
                {friend.username}
                {friend.topay
                  .filter(
                    (item: FriendsExpenseRequestBody) =>
                      item.sendMoney === loggedInUser._id
                  )
                  .filter(
                    (item: FriendsExpenseRequestBody) =>
                      item.status === "accepted"
                  )
                  .map((item: FriendsExpenseRequestBody) =>
                    parseInt(item.amount)
                  )
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  ) -
                  friend.topay
                    .filter(
                      (item: FriendsExpenseRequestBody) =>
                        item.receiveMoney === loggedInUser._id
                    )
                    .filter(
                      (item: FriendsExpenseRequestBody) =>
                        item.status === "accepted"
                    )
                    .map((item: FriendsExpenseRequestBody) =>
                      parseInt(item.amount)
                    )
                    .reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    )}
                <button onClick={() => handleDeleteFriend(friend._id!)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Friend Requests:</h2>
          <ul>
            {friendRequestDetails.map((request, index) => (
              <li key={index}>
                <p>Friend Request from {request.username}</p>
                <button onClick={() => handleAcceptRequest(request._id!)}>
                  Accept
                </button>
                <button onClick={() => handleDeleteRequest(request._id!)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default FriendList;
