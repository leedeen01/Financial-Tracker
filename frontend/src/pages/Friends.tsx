import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import FriendList from "../components/friends/FriendList";
import SearchFriend from "../components/friends/SearchFriend";
import AcceptedPayment from "../components/friends/AcceptedPayment";
import DeclinedPayment from "../components/friends/DeclinedPayment";
import "../components/friends/Friends.css";
import Loader from "../components/loader/Loader";
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
    return (
      <Loader />
    );
  }

  return (
    <>
      <div className="container content">
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
          <div className="col-md-8 mx-auto">
            <AcceptedPayment
              expenseFromFriends={loggedInUser.topay}
              loggedInUser={loggedInUser}
            />
            <br></br>
            <DeclinedPayment
              expenseFromFriends={loggedInUser.topay}
              loggedInUser={loggedInUser}
            />
            <br></br>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friends;
