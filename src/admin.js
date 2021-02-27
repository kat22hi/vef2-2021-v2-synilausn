import express from 'express';
import { list, count, deleter } from './db.js';
export const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function admin(req, res) {
  const errors = [];

  let { offset = 0, limit = 50 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const registrations = await list(offset, limit);
  const numberofsides = await count();

  res.render('admin', {
    errors, registrations, offset, limit, numberofsides,
  });
}

router.get('/', catchErrors(admin));