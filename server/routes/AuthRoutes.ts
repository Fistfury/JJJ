import { Router } from 'express';
import {
  register,
  login,
  loginAdmin,
  logout,
  authorize,
} from '../controllers/AuthController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', loginAdmin);
router.post('/logout', logout);
router.get('/authorize', authorize);

export default router;
