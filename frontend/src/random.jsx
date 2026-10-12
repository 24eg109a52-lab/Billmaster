import axios from "axios";
import { useState } from "react";
import "./Random.css";

function Random() {
    const [users, setUsers] = useState([]);

    async function fetchUsers() {
        try {
            const response = await axios.get("https://dummyjson.com/users");
            setUsers(response.data.users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    return (
        <div>
            <button onClick={fetchUsers}>Fetch Users</button>

            <br /><br />

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Age</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Random;