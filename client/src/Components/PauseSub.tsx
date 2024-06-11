import React from 'react'
import { useParams } from 'react-router-dom';

const PauseSub = () => {
    const _id = useParams()._id;

    const data = { isPaused: true };
    const handlePause = async () => {
        try {
        const response = await fetch(`http://localhost:3000/api/subscriptions/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(data),
    });

    if (response.ok) {
        const result = await response.json();
        console.log(result);
    } else {
        console.error('Error:', response.statusText);

    }
} catch (error) {
    console.error('Error:', error);
}}

  return (
    <div>
        <button className="flex items-center mt-32" onClick={handlePause}>Pause sub</button>
    </div>
  )
}

export default PauseSub