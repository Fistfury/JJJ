import { useState } from 'react';
import { useParams } from 'react-router-dom';

const UpdateSub = () => {
    const { _id } = useParams();
    const [subscriptionLevel, setSubscriptionLevel] = useState("");

    const handleUpdate = async () => {
        const response = await fetch(`http://localhost:3000/api/subscriptions/update${_id}`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(setSubscriptionLevel),
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
    } else {
        console.error('Error:', response.statusText);
    }
    return subscriptionLevel;
}

return (
    <div>
        <button onClick={handleUpdate}>Update subscription</button>
    </div>
  )
}

export default UpdateSub