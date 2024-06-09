import { useState } from 'react'


const DeleteSub = () => {
    const [subscription, setSubscription] = useState();
    

    const handlePause = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/subscriptions/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Subscription data:', result);

      } else {
        const error = await response.json();
        console.error('Subscription error:', error);
      }
      } catch (error) {
        console.error('Subscription error:', error);
      }
    }
   
    


    return (
    <div>
      <button onClick={handlePause}>Delete</button>
    </div>
  )
}

export default DeleteSub