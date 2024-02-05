"use client";
import React, { useState, useEffect } from "react";

/**
 * Props for the LogoutButton component.
 */
interface LogoutButtonProps {
  onLogout: () => void;
}

/**
 * LogoutButton component for rendering a logout button.
 * @param {LogoutButtonProps} props - The component props.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => (
  <button onClick={onLogout}>Logout</button>
);

/**
 * Login component for handling user authentication.
 */
const Login = () => {
  // State for handling user input and authentication status
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<null | {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: string;
    image: string;
  }>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Handles the login process by making an API request.
   */
  const handleLogin = async () => {
    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserData(data); // Store user data

        // Store the token, email, and first name in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("firstName", data.firstName);
      } else {
        alert("Invalid username or password. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  /**
   * Handles the logout process by resetting states and clearing local storage.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null); // Clear user data

    // Clear the token, email, and first name from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("firstName");
  };

  /**
   * useEffect to check if the user is already logged in and has a valid token.
   */
  useEffect(() => {
    // Check if there's a token in local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      // Fetch user data using the token
      fetch("https://dummyjson.com/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      })
        .then((res) => res.json())
        .then((userData) => {
          setIsLoggedIn(true);
          setUserData(userData);
          setLoading(false); // Set loading to false after fetching user data
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserData(null);
          setLoading(false); // Set loading to false in case of an error
        });
    } else {
      setLoading(false); // Set loading to false if there's no token
    }
  }, []);

  /**
   * Render the Login component.
   */
  return (
    <div className="items-center">
      <div className="bg-white p-8 flex justify-around border border-gray-300 shadow-md rounded-md items-center">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-semibold text-gray-600 p-48">
              Loading...
            </p>
          </div>
        )}
        {!loading && isLoggedIn && userData && (
          <>
            <div className="flex-col">
              <div className="flex items-center gap-40 mb-4">
                <div className="flex-1 border border-gray-300 shadow-md p-16 rounded-md">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome, {userData.username}!
                  </h1>
                  <p className="text-lg text-gray-800">ID: {userData.id}</p>
                  <p className="text-lg text-gray-800">
                    Email: {userData.email}
                  </p>
                  <p className="text-lg text-gray-800">
                    First Name: {userData.firstName}
                  </p>
                  <p className="text-lg text-gray-800">
                    Last Name: {userData.lastName}
                  </p>
                  <p className="text-lg text-gray-800">
                    Gender: {userData.gender}
                  </p>
                </div>
                <img
                  src={userData.image}
                  alt={`${userData.username}'s profile`}
                  className="object-contain"
                />
              </div>
              <div className="ml-48">
                <div className="btn btn-primary bg-red-500 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none">
                  <LogoutButton onLogout={handleLogout} />
                </div>
              </div>
            </div>
          </>
        )}
        {!loading && !isLoggedIn && (
          <>
            {/* Login form */}
            <div className="mb-6 border border-gray-300 shadow-md rounded-md p-16">
              <h1 className="text-3xl font-bold mb-6">Login</h1>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm font-semibold mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-semibold mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            {/* DummyJSON information */}
            <div className="ml-6 border border-gray-300 shadow-md rounded-md p-10">
              <h2 className="text-xl font-semibold mb-2">From DummyJSON</h2>
              <ul className="list-disc ml-6">
                <li>Username: kminchelle - Password: 0lelplR</li>
                <li>Username: atuny0 - Password: 9uQFF1Lh</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Export the component
export default Login;
