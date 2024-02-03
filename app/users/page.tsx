import React from "react";
interface User {
  id: number;
  firstName: string;
}

// Fetching data in server component to avoid the additional roundtrip in server if we do it in client component

// Define the ApiResponse type because it contains User[]
interface ApiResponse {
  users: User[];
}

const UsersPage = async () => {
  const res = await fetch("https://dummyjson.com/users", { cache: "no-store" });
  const userApiResponse: ApiResponse = await res.json();
  const users: User[] = userApiResponse.users.map((user) => {
    return { id: user.id, firstName: user.firstName };
  });
  return (
    <>
      <h1>Users</h1>
      <p>{new Date().toLocaleTimeString()}</p>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.firstName}</li>
        ))}
      </ul>
    </>
  );
};

export default UsersPage;
