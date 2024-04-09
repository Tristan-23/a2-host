const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const { response } = require("express");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  if (process.env.PRINT === "TRUE") {
    console.log("sv_mysql.js : MariaDB is connected");
  }
  if (process.env.DEBUG === "TRUE") {
    console.log(
      "sv_mysql.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
    console.log("sv_mysql.js : Connected to MariaDB with = {");
    console.log(
      "sv_mysql.js :      User                : ",
      connection.config.user
    );
    console.log(
      "sv_mysql.js :      Password            : ",
      connection.config.password
    );
    console.log(
      "sv_mysql.js :      Adres               : ",
      connection.config.host + ":" + connection.config.port
    );
    console.log("sv_mysql.js : }");
    console.log(
      "sv_mysql.js : \x1b[31mWe advice not sharing these credentials!\x1b[37m"
    );
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  async registerUser(email, password) {
    try {
      const existingUser = await this.getUserByEmail(email);
      if (existingUser) {
        throw new Error("Email is already registered");
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const insertId = await new Promise((resolve, reject) => {
        const query = "INSERT INTO users (email, password) VALUES (?, ?);";
        connection.query(query, [email, passwordHash], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });

      return {
        id: insertId,
        email: email,
      };
    } catch (error) {
      throw error;
    }
  }

  async getUserByCredentials(identifier, email, password) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM users WHERE";
      const queryParams = [];

      if (identifier) {
        query += " identifier = ? AND";
        queryParams.push(identifier);
      }

      if (email) {
        query += " email = ? AND";
        queryParams.push(email);
      }

      if (password) {
        query += " password = ? AND";
        queryParams.push(password);
      }

      if (queryParams.length > 0) {
        query = query.slice(0, -4);
      } else {
        reject(
          new Error("At least one of id, email, or password must be provided.")
        );
        return;
      }

      connection.query(query, queryParams, (err, result) => {
        if (err) reject(new Error(err.message));
        resolve(result[0]);
      });
    });
  }

  async getAllDataFromTable(table) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM ${table};`;

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async searchForHours(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = `SELECT * FROM dashboard WHERE user = ? ORDER BY id;`;

        connection.query(query, [id], (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);
        });
      });

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async insertHour(userID, insertDate) {
    console.log(insertDate);
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO dashboard (user, inklok, date) VALUES (?, ?, ?)";

        connection.query(
          query,
          [userID, insertDate, insertDate],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return { id: insertId };
    } catch (error) {
      console.error(error);
    }
  }

  async updateHour(currentRow, userID, insertDate, durationDate) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE dashboard SET uitklok = ?, duration = ? WHERE user = ? AND id = ?";

        connection.query(
          query,
          [insertDate, durationDate, userID, currentRow],
          (err, result) => {
            if (err) reject(err);
            resolve(result.affectedRows);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = DbService;
