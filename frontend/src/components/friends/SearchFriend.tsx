import { User } from "../../models/user";
import * as ExpensesApi from "../../network/expenses_api";
import { useState } from "react";

interface SearchFriendProps {
  loggedInUser: User;
}

const SearchFriend = ({ loggedInUser }: SearchFriendProps) => {
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
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

  return (
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
  );
};

export default SearchFriend;
