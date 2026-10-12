import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginUser({
      ...loginUser,
      [e.target.name]: e.target.value
    });
  };

  async function submit() {
    try {
      await axios.post("http://localhost:8080/students/login", loginUser);
      alert("User login successful");
      navigate("/home");
    } catch (err) {
      alert("Email or Password is Wrong");
    }
  }

  return (
    <>
      <h1>Login Page</h1>
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
      <button onClick={submit}>Login</button>
      <p>
        <Link to="/register">new user?</Link>
      </p>
    </>
  );
}

export default Login;
