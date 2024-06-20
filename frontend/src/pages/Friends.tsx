import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";

const Friends = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [friendDetails, setFriendDetails] = useState<User[]>([]); // Ensure friendDetails is typed as User[]
  const [friendRequestDetails, setFriendRequestDetails] = useState<User[]>([]); // Ensure friendDetails is typed as User[]

  // Function to fetch logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const fetchedUser = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  // Initial fetch of logged-in user
  useEffect(() => {
    if (!loggedInUser) {
      fetchLoggedInUser();
    }
  }, [loggedInUser]);
  // Periodic refresh mechanism using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      if (loggedInUser) {
        fetchLoggedInUser(); // Fetch updated friend requests periodically
      }
    }, 5000); // Refresh every 5 seconds (adjust as needed)

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [loggedInUser]);

  useEffect(() => {}, []);

  // Function to handle search
  const handleSearch = async () => {
    try {
      const result = await ExpensesApi.searchUsersByUsername(username);
      setSearchResult(result);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  // Function to send friend request
  const handleSendRequest = async (userId: string) => {
    try {
      await ExpensesApi.sendRequest(loggedInUser!._id!, userId);
      handleSearch();
      console.log("Friend request sent successfully!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

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
      console.log(friendId);
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
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username to search"
        />
        <button onClick={handleSearch}>Search</button>
        <ul>
          {searchResult
            .filter(
              (user) =>
                user.username !== loggedInUser?.username &&
                !user.friendlist.includes(loggedInUser!._id!)
            )
            .map((user) => (
              <li key={user.username}>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <button
                  onClick={() => handleSendRequest(user._id!)}
                  disabled={user.friendRequest.includes(loggedInUser!._id!)}
                >
                  {user.friendRequest.includes(loggedInUser!._id!)
                    ? "Request Sent"
                    : "Send Friend Request"}
                </button>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <div>
          <h2>Friend List:</h2>
          <ul>
            {friendDetails.map((friend, index) => (
              <li key={index}>
                {friend.username}
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

export default Friends;
