import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import FriendList from "../components/friends/FriendList";
import SearchFriend from "../components/friends/SearchFriend";
import "../components/friends/Friends.css";
import Loader from "../components/loader/Loader";
import Split from "./Split";
const Friends = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  // Function to fetch logged-in user
  const fetchLoggedInUser = async () => {
    try {
      const fetchedUser = await ExpensesApi.getLoggedInUser();
      setLoggedInUser(fetchedUser);
    } catch (error) {
      console.error("Error fetching logged-in user:", error);
    }
  };

  useEffect(() => {
    if (loggedInUser) {
      const interval = setInterval(fetchLoggedInUser, 5000);
      return () => clearInterval(interval);
    } else {
      fetchLoggedInUser();
    }
  }, [loggedInUser]);

  if (!loggedInUser) {
    return <Loader />;
  }

  return (
    <>
      <div className="container content mb-5">
        <div className="row gap-5 mt-5">
          <div className="col-md-8 mx-auto">
            <SearchFriend loggedInUser={loggedInUser} />
          </div>
          <div className="col-md-8 mx-auto">
            <FriendList
              loggedInUser={loggedInUser}
              fetchLoggedInUser={fetchLoggedInUser}
            />
          </div>
        </div>
        <Split />
      </div>
    </>
  );
};

export default Friends;
