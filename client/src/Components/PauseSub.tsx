import { useParams } from 'react-router-dom';
import { useUser } from '../Contexts/UserContext';

const PauseSub = () => {
    const data = {isPaused: true};
    const {user} = useUser();
    console.log(user);

    const handlePause = async () => {
        if(!user?.subscriptionId) {
            console.error("user or subscriptionId is undefined")
            return;
        }
        if (window.confirm('Are you sure you want to pause your subscription?')) {
        const response = await fetch(`http://localhost:3000/api/subscriptions/${user?.subscriptionId}`, {
            method: 'PUT',
            headers: {
                "content-type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(data),
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
    } else {
        console.error('Error:', response.statusText);

    }
}}

  return (
    <div className='flex items-center justify-start mt-10'>
        <button className="btn btn-primary w-full" onClick={handlePause}>Pause subscription</button>
    </div>
  )
}

export default PauseSub