import { useEffect, useState } from "react";
import { User } from "../models/user";
import * as ExpensesApi from "../network/expenses_api";
import SplitBill from "../components/split/SplitBill";
import "../components/split/Split.css";
import Loader from "../components/loader/Loader";

const Split = () => {
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
    return (
      <Loader />
    );
  }

  return (
    <>
    <div className="container content">
      <div className="row mt-5">
        <div className="col-md-8 d-flex flex-column align-items-center justify-content-center mx-auto gap-3">
          <h1>Split Bills</h1>
          <p className="text-center">Use this interface to split a bill with your friends below.</p>
          <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <div className="checkbox-container d-flex flex-wrap gap-5 align-items-center justify-content-center">
              {friendDetails.map((user) => (
                  <label className="checkbox-wrapper" key={user._id}>
                    <input className="checkbox-input" type="checkbox" checked={selectedUsers.some((u) => u._id === user._id)}  onChange={() => handleCheckboxChange(user)}/>
                    <span className="checkbox-tile">
                      <span className="checkbox-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          className="icon"
                        >
                          <path
                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                          ></path>
                        </svg>
                      </span>
                      <span className="checkbox-label overflow-name">{user.username}</span>
                    </span>
                  </label>
              ))}
            </div>
            <button type="submit" className="split-button" disabled={selectedUsers.length === 0}>
              Split a Bill
            </button>
          </form>
        </div>
      </div>
    </div>

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

export default Split;
