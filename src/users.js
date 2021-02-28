import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export async function query(q, values = []) {
  const client = await pool.connect();
  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    console.error("Villa í query", err);
    throw err;
  } finally {
    client.release();
  }
  return result;
}

export async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);
  return result;
}

// Merkjum sem async þó ekki verið að nota await, þar sem þetta er notað í
// app.js gerir ráð fyrir async falli
export async function findById(id) {
  const q = `SELECT * 
             FROM users 
             WHERE id = $1`;

  try {
    const result = await query(q, [id]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error("Gat ekki fundið notanda eftir id");
  }

  return null;
}

// Merkjum sem async þó ekki verið að nota await, þar sem þetta er notað í
// app.js gerir ráð fyrir async falli
export async function findByUsername(username) {
  const q = `SELECT * 
             FROM users 
             WHERE username = $1`;

  try {
    const result = await query(q, [username]);

    if (result.rowCount === 1) {
      return result.rows[0];
    }
  } catch (e) {
    console.error("Gat ekki fundið notanda eftir notendnafni");
    return null;
  }

  return false;
}

export async function createNewUser(username, password) {
  const cryptPassword = await bcrypt.hash(password, 11);

  const q = `
  INSERT INTO
  users (username, password)
  VALUES ($1, $2)`;

  return query(q, [username, cryptPassword]);
}
