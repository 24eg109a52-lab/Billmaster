import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  async function getAllUsers() {
    try {
      const response = await axios.get("http://localhost:8080/students");
      setUsers(response.data);
    } catch (err) {
      alert("Unable to get the users...");
    }
  }

  async function userUpdate(user) {
    const name = prompt("enter your updated name", user.name);
    const email = prompt("enter your updated email", user.email);
    if (!name || !email) return;

    const updatedUser = {
      name: name,
      email: email
    };
    try {
      await axios.put(`http://localhost:8080/students/${user.id}`, updatedUser);
      alert("User updated Successfully");
      getAllUsers();
    } catch (err) {
      alert("Update Failed");
    }
  }

  async function deleteUser(id) {
    try {
      await axios.post(`http://localhost:8080/students/${id}`);
      alert("User Deleted successfully");
      getAllUsers();
    } catch (err) {
      alert("Deletion Failed");
    }
  }

  function logout() {
    navigate("/");
  }

  return (
    <>
      <h3>Dashboard Page</h3>
      <button onClick={getAllUsers}>GetAll</button>
      <button onClick={logout}>logout</button>
      <table border={1}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>User Name</th>
            <th>User Role</th>
            <th>User Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => userUpdate(user)}>Update</button>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Dashboard;
