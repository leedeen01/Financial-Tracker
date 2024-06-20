import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import FriendList from "../components/friends/FriendList";
import SearchFriend from "../components/friends/SearchFriend";
import SplitBill from "../components/friends/SplitBill";

const Friends = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSplitBill, setShowSplitBill] = useState(false);

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

  return (
    <>
      <SearchFriend loggedInUser={loggedInUser!} />
      <FriendList
        loggedInUser={loggedInUser!}
        fetchLoggedInUser={fetchLoggedInUser}
      />
      <button onClick={() => setShowSplitBill(true)}> Split a Bill </button>
      {showSplitBill && <SplitBill onDismiss={() => setShowSplitBill(false)} />}
    </>
  );
};

export default Friends;
