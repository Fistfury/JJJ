import { Collection } from 'mongodb';
import { getCollection } from '../config/db';

interface Admin {
    email: string;
    password: string;
}

const fetchAdmins = async (): Promise<Admin[]> => {
    const adminsCollection: Collection<Admin> = await getCollection<Admin>('admin');
    return adminsCollection.find().toArray();
};

export default fetchAdmins;
