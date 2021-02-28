import express from 'express';
import { list, deleteSignature, countSignatures } from './db.js';
export const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function erase(req, res) {
  let success = true;
  
  if (!req.isAuthenticated()) {
    return res.redirect('/admin/login');
  }
  const {
    id,
  } = req.body;

  try {
    success = await deleteSignature({ nationalId: id });
  } catch (e) {
    console.error(e);
  }
  if (success) {
    return res.redirect('/admin');
  }
  return res.render('error', {
    title: 'Villa við að eyða',
    text: '',
  });
}

async function admin(req, res) {
  const errors = [];
  const numberofsides = await countSignatures();

  let { offset = 0, limit = 50 } = req.query;
  offset = Number(offset);
  limit = Number(limit);

  const registrations = await list(offset, limit);
  res.render('admin', {
    errors, registrations, offset, limit, numberofsides,
  });
}

router.get('/', catchErrors(admin));
router.post('/delete', catchErrors(erase), catchErrors(admin));