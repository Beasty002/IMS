import React, { useEffect, useState } from "react";
import bgImage from "../../assets/bg.jpg";
import "./Login.css";
import { useAuth } from "../../customHooks/useAuth";
import { ToastContainer, toast } from "react-toastify";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { authenticateUser } = useAuth();

  const handleFormFill = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(JSON.stringify(formData));
    if (!formData.username || !formData.password) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unauthorized.");
      }

      const data = await response.json();
      console.log(data);
      authenticateUser();
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <>
      <main id="bgCover">
        <img id="bgImage" src={bgImage} alt="" />
        <section id="loginContainer">
          <h1>Welcome Back</h1>
          <form onSubmit={handleLogin}>
            <div class="form-container-login">
              <i class="fa-solid fa-user"></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormFill}
                placeholder="Username"
              />
            </div>
            <div class="form-container-login">
              <i class="fa-solid fa-lock"></i>
              <input
                type="password"
                value={formData.password}
                onChange={handleFormFill}
                name="password"
                placeholder="Password"
              />
            </div>
            <button type="submit" id="formSubmit">
              Login
            </button>
          </form>
        </section>
      </main>
      <ToastContainer />
    </>
  );
}

export default Login;
