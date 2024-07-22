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
    <>
    <div className="row g-3 mb-3">
      <div className="col-md-12 d-flex justify-content-center">
        <div className="h-md-100">
          <div className="card-body p-0 search-friend-container">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search Friends"
              className="search-friend-input"
            />
            <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
            </svg>
            <button onClick={handleSearch} className="search-friend-button">Search</button>
          </div>
        </div>
      </div>
    </div>

    <div className="row g-3 mb-3">
      {searchResult.length > 0 ?
      searchResult
        .filter(
          (user) =>
            user.username !== loggedInUser?.username &&
            !user.friendlist.includes(loggedInUser!._id!)
        )
        .map((user) => (
          <div className="col-md-12" key={user._id}>
            <div className="card h-md-100">
              <div className="card-header pb-0 d-flex">
                <img src={user.picture ? user.picture : import.meta.env.VITE_DEFAULT_PIC} alt="" className="profile-pic-friend mt-3 mb-3" style={{marginRight: "10px"}} />
                <h6 className="mb-2 mt-2 d-flex align-items-center">{user.username}</h6>
              </div>
    
              <div className="card-body d-flex flex-row justify-content-between align-items-center">
                <p className="overflow-text mb-0">Email: {user.email}</p>
                <button
                  onClick={() => handleSendRequest(user._id!)}
                  disabled={user.friendRequest.includes(loggedInUser!._id!)}
                  className="add-friend-button"
                >
                  {user.friendRequest.includes(loggedInUser!._id!)
                    ? "Request Sent"
                    : "Send Friend Request"}
                </button>
              </div>
            </div>
          </div>
        ))
        :
        <div className="col-md-12">
          <div className="card h-md-100">    
            <div className="card-body d-flex flex-row justify-content-between align-items-center">
              <p className="mb-0 text-center mx-auto">No search results. Try searching for a different name.</p>
            </div>
          </div>
        </div>
        }
    </div>
    </>
  );
};

export default SearchFriend;