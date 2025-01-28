import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome/Welcome";
import Chat from "./components/Chat/Chat";
import axios from "axios";

function App() {
  // State to store the selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // State to store the list of users
  const [users, setUsers] = useState([]);

  // Effect to fetch users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Route for the Welcome component */}
        <Route
          path="/"
          element={<Welcome setSelectedUser={setSelectedUser} />}
        />
        {/* Route for the Chat component */}
        <Route
          path="/:username/chat"
          element={<Chat selectedUser={selectedUser} users={users} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
