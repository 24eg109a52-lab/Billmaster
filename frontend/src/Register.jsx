import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [registerUser, setRegisterUser] = useState({
    name: "",
    role: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setRegisterUser({
      ...registerUser,
      [e.target.name]: e.target.value
    });
  };

  async function submit() {
    try {
      await axios.post("http://localhost:8080/students/register", registerUser);
      alert("User Registered successfully..");
      navigate("/");
    } catch (err) {
      alert("Registration Failed...");
    }
  }

  return (
    <>
      <h1>Register Page</h1>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="role"
        placeholder="Enter your role"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        onChange={handleChange}
      />

      <button onClick={submit}>Register</button>
      <p>
        <Link to="/">Do you already have account?</Link>
      </p>
    </>
  );
}

export default Register;
