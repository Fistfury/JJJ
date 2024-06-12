import { useEffect, useState } from "react";
import PauseSub from "../Components/PauseSub";
import { motion } from "framer-motion";
import { IUser } from "../Interfaces/IUser";

export const Account = () => {
  const [subscription, setSubscription] = useState([]);
  const [user, setUser] = useState<IUser | null>(null);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/subscriptions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchSubscription();
    fetchUserDetails();
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-cover bg-gray-800 bg-opacity-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.div
        initial={{ x: '-100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        style={{ width: "560px" }}
      >
        <div className="relative p-12 glass rounded-lg shadow-lg max-w-xl w-full">
          {user && (
            <p className="text-lg  font-semibold mb-10 text-white">
              Hello, &nbsp; <span className="text-teal-300"> { user.name || user.email}</span>
            </p>
          )}
          <p className="text-lg font-semibold mb-6 text-white">
            Your subscription level: <span className="text-teal-300 ml-2">{subscription}</span>
          </p>
          <PauseSub />
        </div>
      </motion.div>
    </div>
  );
};
