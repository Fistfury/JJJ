import { Router } from 'express';
import {
  register,
  registerAdmin,
  login,
  loginAdmin,
  logout,
  authorize,
} from '../controllers/AuthController';

const router = Router();

router.post('/register', register);
router.post('/admin/register', registerAdmin);
router.post('/login', login);
router.post('/admin/login', loginAdmin);
router.post('/logout', logout);
router.get('/authorize', authorize);

export default router;
