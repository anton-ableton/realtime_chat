import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Welcome.css";
import userIcon from "../../assets/user.svg";
import searchIcon from "../../assets/search.svg";
import { fetchUsers } from "../../api";

function Welcome() {
  // Initialize the navigate function from react-router-dom
  const navigate = useNavigate();

  // State to store the search query
  const [searchQuery, setSearchQuery] = useState("");

  // State to store the list of users
  const [users, setUsers] = useState([]);

  // Effect to fetch users when the component mounts
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  // Handler for navigating to the chat page of a selected user
  const handleEnter = (user) => {
    const formattedUsername = user.username.toLowerCase().replace(/[._]/g, "-");
    navigate(`/${formattedUsername}/chat`, { state: { user } });
  };

  // Filter users based on the search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="welcome-container">
      <div className="form-container">
        <h1 className="welcome-title">Welcome to Sibers Chat!</h1>

        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>

        <div className="list-container">
          {filteredUsers.length === 0 && (
            <p className="gray-title">No users found</p>
          )}
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              className="user-choose"
              onClick={() => handleEnter(user)}
            >
              <img src={userIcon} alt="userIcon" />
              <div className="user-info">
                <span>{user.username}</span>
                <p className="email-title">{user.email}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="gray-title">Choose user</div>
      </div>
    </div>
  );
}

export default Welcome;
