import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import FriendList from "../components/friends/FriendList";
import SearchFriend from "../components/friends/SearchFriend";
import SplitBill from "../components/friends/SplitBill";
import PendingPayment from "../components/friends/PendingPayment";
import AcceptedPayment from "../components/friends/AcceptedPayment";
import DeclinedPayment from "../components/friends/DeclinedPayment";
const Friends = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSplitBill, setShowSplitBill] = useState(false);
  const [friendDetails, setFriendDetails] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Function to fetch logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const fetchedUser = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  // Function to fetch friend details
  const fetchFriendDetails = async () => {
    try {
      if (loggedInUser) {
        const promises = loggedInUser.friendlist.map((friendId) =>
          ExpensesApi.searchUsersById(friendId)
        );
        const friendData = await Promise.all(promises);
        setFriendDetails([loggedInUser, ...friendData]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      fetchFriendDetails();

      const interval = setInterval(fetchLoggedInUser, 5000);
      return () => clearInterval(interval);
    } else {
      fetchLoggedInUser();
    }
  }, [loggedInUser]);

  // Function to handle checkbox change
  const handleCheckboxChange = (user: User) => {
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.some((u) => u._id === user._id)) {
        return prevSelectedUsers.filter((u) => u._id !== user._id);
      } else {
        return [...prevSelectedUsers, user];
      }
    });
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can perform actions with selectedUsers array, such as saving it or sending to a server
    console.log("Selected Users:", selectedUsers);

    // Optionally, reset checkboxes to unchecked state
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    // Show the SplitBill component
    setShowSplitBill(true);
  };

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SearchFriend loggedInUser={loggedInUser} />
      <FriendList
        loggedInUser={loggedInUser}
        fetchLoggedInUser={fetchLoggedInUser}
      />
      <h1>Splitting Bill</h1>
      <form onSubmit={handleSubmit}>
        {friendDetails.map((user) => (
          <label
            key={user._id}
            className="container"
            style={{ display: "block" }}
          >
            <input
              type="checkbox"
              checked={selectedUsers.some((u) => u._id === user._id)}
              onChange={() => handleCheckboxChange(user)}
            />
            {user.username}
          </label>
        ))}
        <button type="submit" disabled={selectedUsers.length === 0}>
          Split a Bill
        </button>
      </form>
      <PendingPayment
        expenseFromFriends={loggedInUser.topay}
        loggedInUser={loggedInUser}
      />
      <AcceptedPayment
        expenseFromFriends={loggedInUser.topay}
        loggedInUser={loggedInUser}
      />
      <DeclinedPayment
        expenseFromFriends={loggedInUser.topay}
        loggedInUser={loggedInUser}
      />

      {showSplitBill && (
        <SplitBill
          onDismiss={() => setShowSplitBill(false)}
          loggedInUser={loggedInUser!}
          userToSplit={selectedUsers} // Pass selectedUsers here
        />
      )}
    </>
  );
};

export default Friends;
