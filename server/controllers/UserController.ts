import { Request, Response } from 'express';
import { fetchUserByEmail} from '../helpers/FetchUsers';

class UserController {
 

  async getUserByEmail(req: Request, res: Response) {
    const email = req.params.email;
    const user = await fetchUserByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
}

export default new UserController();