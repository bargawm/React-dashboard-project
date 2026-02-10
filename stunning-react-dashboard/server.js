
import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./db.sqlite");

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user',
  approved INTEGER DEFAULT 0
)`);

const adminEmail = "test@test.com";
const adminPassword = bcrypt.hashSync("Test123@123", 10);

db.run(
  `INSERT OR IGNORE INTO users (email, password, role, approved)
   VALUES (?, ?, 'admin', 1)`,
  [adminEmail, adminPassword]
);

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email.includes("@")) return res.status(400).json({ msg: "Invalid email" });
  const hash = await bcrypt.hash(password, 10);
  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hash],
    err => err ? res.status(400).json({ msg: "User exists" }) : res.json({ msg: "Pending approval" })
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (_, user) => {
    if (!user) return res.status(401).json({ msg: "Invalid credentials" });
    if (!user.approved) return res.status(403).json({ msg: "Not approved" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, "SECRET");
    res.json({ token, role: user.role });
  });
});

app.get("/pending", (_, res) => {
  db.all(`SELECT id,email FROM users WHERE approved = 0`, (_, rows) => res.json(rows));
});

app.post("/approve/:id", (req, res) => {
  db.run(`UPDATE users SET approved = 1 WHERE id = ?`, [req.params.id]);
  res.json({ ok: true });
});

app.listen(5000, () => console.log("Server running on 5000"));
