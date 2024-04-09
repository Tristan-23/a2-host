const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const exportMysql = require("../database/sv_mysql");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
  if (process.env.PRINT === "TRUE") {
    console.log("sv_script.js : Node is active");
  }

  if (process.env.DEBUG === "TRUE") {
    console.log(
      "sv_script.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
    console.log("sv_script.js : Node is running with = {");
    console.log("sv_mysql.js :      Running on port      : ", process.env.PORT);
    console.log("sv_script.js : }");
    console.log(
      "sv_script.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
  }
});

app.post("/register", async (request, response) => {
  const { email, password } = request.body;

  try {
    const db = exportMysql.getDbServiceInstance();
    const result = await db.registerUser(email, password);

    response.json({ data: result });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;

  try {
    const db = exportMysql.getDbServiceInstance();
    const user = await db.getUserByCredentials(undefined, email, undefined);

    if (!user) {
      response.status(401).json({ error: "User not found" });
    } else {
      bcrypt.compare(password, user.password, (err, isPasswordValid) => {
        if (err) {
          response.status(500).json({ error: "Internal Server Error" });
        } else if (isPasswordValid) {
          response.json({ data: { id: user.identifier, email: user.email } });
        } else {
          response.status(401).json({ error: "Invalid credentials" });
        }
      });
    }
  } catch (error) {
    response.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/search/:name", (request, response) => {
  const { name } = request.params;
  const db = exportMysql.getDbServiceInstance();
  const result = db.getAllDataFromTable(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.get("/searchHours/:id", (request, response) => {
  const { id } = request.params;

  const db = exportMysql.getDbServiceInstance();
  const result = db.searchForHours(id);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.post("/insertTime", async (request, response) => {
  const { user, time } = request.body;

  try {
    const db = exportMysql.getDbServiceInstance();
    const result = await db.insertHour(user, time);

    response.json({ data: result });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/updateTime", (request, response) => {
  const { row, user, time, duration } = request.body;

  try {
    const db = exportMysql.getDbServiceInstance();
    const result = db.updateHour(row, user, time, duration);

    response.json({ data: result });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
});

process.on("SIGINT", () => {
  if (process.env.PRINT === "TRUE") {
    console.log("sv_script.js : Node is deactivated");
  }
  connection.end();
  process.exit();
});
