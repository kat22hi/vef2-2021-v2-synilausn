import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { query } from './db.js';

dotenv.config();

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
    console.error('Gat ekki fundið notanda eftir id');
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
    console.error('Gat ekki fundið notanda eftir notendnafni');
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
