import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

let pool;

export async function connectDB() {
  if (!pool) {

    const dbUrl = new URL('mysql://gha379c3ubaxoz10zuji:pscale_pw_JftbFxUbgF409L288aHDXWYgq9EB8OvI7BVEyHUuqzD@aws.connect.psdb.cloud/kingkong-motor?ssl={"rejectUnauthorized":true}');  

    if (!dbUrl) {
      throw new Error('DB_URL is not defined in the environment variables');
    }

    pool = mysql.createPool(dbUrl).promise();
  }
  return pool;
}

export async function queryDB(queryString, values) {
  try {
    const connPool = await connectDB();
    const [rows] = await connPool.execute(queryString, values);
    return rows;
  } catch (error) {
    throw new Error(`Error executing query: ${error.message}`);
  }
}