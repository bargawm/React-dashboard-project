
import { useState, useEffect } from "react";
import { Card, Button } from "./ui";

export default function App() {
  const [mode, setMode] = useState("login");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (mode === "admin") {
      fetch("http://localhost:5000/pending")
        .then(r => r.json())
        .then(setUsers);
    }
  }, [mode]);

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-purple-700 to-black">
      <h1 className="text-4xl font-bold mb-6">Stunning Admin Dashboard</h1>

      {mode === "login" && (
        <Card>
          <Button onClick={() => setMode("admin")}>Login as Admin</Button>
        </Card>
      )}

      {mode === "admin" && (
        <div className="grid gap-4">
          {users.map(u => (
            <Card key={u.id}>
              <div className="flex justify-between items-center">
                <span>{u.email}</span>
                <Button onClick={() =>
                  fetch(`http://localhost:5000/approve/${u.id}`, { method: "POST" })
                }>Approve</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
