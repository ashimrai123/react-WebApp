import React from "react";
interface User {
  id: number;
  firstName: string;
  email: string;
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
    return { id: user.id, firstName: user.firstName, email: user.email };
  });
  return (
    <>
      <h1>Users</h1>
      <table className=" table table-zebra	table-md	">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UsersPage;
