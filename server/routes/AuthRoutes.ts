import { Router } from 'express';
import {
  register,
  login,
  loginAdmin,
  logout,
  authorize,
  getUserDetails,
} from '../controllers/AuthController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/adminlogin', loginAdmin);
router.post('/logout', logout);
router.get('/authorize', authorize);
router.get('/user', authorize, getUserDetails);

export default router;
