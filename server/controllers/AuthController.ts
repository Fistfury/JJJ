import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Stripe from 'stripe';
import { getCollection } from '../config/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-04-10',
});

interface User {
    email: string;
    password: string;
    stripeCustomerId: string;
}

interface Admin {
    email: string;
    password: string;
}

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

        req.session.user = userExists;
        res.status(200).json(userExists.email);
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

        if (!adminExists || !(await bcrypt.compare(password, adminExists.password))) {
            res.status(400).json('Fel e-postadress eller lösenord');
            return;
        }

        req.session.admin = adminExists;
        res.status(200).json(adminExists.email);
    } catch (error) {
        console.error(error);
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
    if (!req.session.user && !req.session.admin) {
        res.status(401).json('Du är inte inloggad');
        return;
    }
    res.status(200).json(req.session.user || req.session.admin);
};

export { register, login, loginAdmin, logout, authorize };
