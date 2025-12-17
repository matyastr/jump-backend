const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("../jump-database.db");
console.log(
  "Server is looking for the database at:",
  path.resolve("../jump-database.db")
);

app.get("/", (req, res) => {
  res.send("Server is alive and running!");
});

app.get("/get-data", (req, res) => {
  db.serialize(() => {
    db.all("SELECT * FROM SingleValues", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });
});

app.post("/add-data", (req, res) => {
  console.log("Received data:", req.body);

  const { Value } = req.body;

  console.log(Value);
  const sql = "INSERT INTO SingleValues (Value) VALUES (?)";

  const params = [Value];

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: "Success!",
      id: this.lastID,
    });
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});