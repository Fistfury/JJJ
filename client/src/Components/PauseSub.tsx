import { useParams } from 'react-router-dom';

const PauseSub = () => {
    const { _id } = useParams();
    const data = {isPaused: true}

    const handlePause = async () => {
        if (window.confirm('Are you sure you want to pause your subscription?')) {
        const response = await fetch(`http://localhost:3000/api/subscriptions/${_id}`, {
            method: 'PUT',
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