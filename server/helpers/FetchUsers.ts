import { Collection } from 'mongodb';
import { getCollection } from '../config/db';

interface User {
    email: string;
    password: string;
    stripeCustomerId: string;
}

const fetchUsers = async (): Promise<User[]> => {
    const usersCollection: Collection<User> = await getCollection<User>('user');
    return usersCollection.find().toArray();
};

export default fetchUsers;
