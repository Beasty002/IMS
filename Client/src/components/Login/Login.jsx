import React, { useState, useLayoutEffect } from "react";
import bgImage from "../../assets/bg.jpg";
import "./Login.css";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <main id="bgCover">
        <img id="bgImage" src={bgImage} alt="" />
        <section id="loginContainer">
          <h1>Welcome Back</h1>
          <form onSubmit={handleLogin}>
            <div class="form-container">
              <i class="fa-solid fa-user"></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormFill}
                placeholder="Username"
              />
            </div>
            <div class="form-container">
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
    </>
  );
}

export default Login;
