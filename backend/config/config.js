require('dotenv').config();


const env = process.env;

module.exports = {
  "development": {
    "username": "root",
    "password": env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": env.DB_PASSWORD,
    "database": "react-nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
