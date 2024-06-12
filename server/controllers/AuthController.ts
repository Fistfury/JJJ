import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { stripe } from '../config/stripe';
import { getCollection } from '../config/db';


interface User {
    email: string;
    password: string;
    stripeCustomerId: string;
    _id?: string;
}

interface Admin {
    email: string;
    password: string;
}

interface Session {
    user? : User;
    admin? : Admin;
}

export const getUserDetails = async (req: Request, res: Response) => {
    try {
     
      const session = req.session as Session;
      if (!session || !session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      const userId = session.user._id;
      const usersCollection = await getCollection<User>('users');
      const user = await usersCollection.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ error: 'Failed to retrieve user details' });
    }
  };

const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const usersCollection = await getCollection<User>('user');
        const userAlreadyExists = await usersCollection.findOne({ email });

        if (userAlreadyExists) {
            res.status(400).json('Användaren finns redan, välj en annan e-postadress');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await stripe.customers.create({
            email: email,
        });

        const newUser: User = {
            email,
            password: hashedPassword,
            stripeCustomerId: customer.id,
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json(newUser.email);
    } catch (error) {
        console.error(error);
        res.status(500).json('Serverfel');
    }
};


const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const usersCollection = await getCollection<User>('user');
        const userExists = await usersCollection.findOne({ email });

        if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
            res.status(400).json('Fel e-postadress eller lösenord');
            return;
        }

        console.log(userExists);
        (req.session as Session).user = userExists;
        res.status(200).json({ email: userExists.email, stripeCustomerId: userExists.stripeCustomerId });
      } catch (error) {
        console.error(error);
        res.status(500).json('Serverfel');
    }
};



const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    try {
      const adminsCollection = await getCollection<Admin>('admin');
  
      const adminExists = await adminsCollection.findOne({ email });
      if (!adminExists) {
        res.status(400).json('Fel e-postadress eller lösenord');
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, adminExists.password);
      if (!isPasswordValid) {
        res.status(400).json('Fel e-postadress eller lösenord');
        return;
      }
  
      (req.session as Session).admin = adminExists;
      res.status(200).json(adminExists.email);
    } catch (error) {
      res.status(500).json('Serverfel');
    }
  };
  


const logout = (req: Request, res: Response): void => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).json('Logout failed');
            return;
        }
        res.status(200).json('Du är nu utloggad');
    });
};

const authorize = (req: Request, res: Response): void => {
    if (!(req.session as Session).user && !(req.session as Session).admin) {
        res.status(401).json('Du är inte inloggad');
        return;
    }
    res.status(200).json((req.session as Session).user || (req.session as Session).admin);
};

export { register, login, loginAdmin, logout, authorize };
