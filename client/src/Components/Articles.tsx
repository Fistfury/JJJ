import { useEffect, useState } from 'react';

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => { 
        const fetchArticles = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/subscriptions/articles', {
            method: 'GET',
            credentials: 'include',
          });
          console.log('Response:', response);
          if(response.status === 200) {
            const data = await response.json();
            setArticles(data);
          } else {
            console.log("No articles found");
          } 
        } catch (error) {
          console.error('Error fetching articles:', error);
        }
      };

    fetchArticles();
}, [])
if (!articles) {
      return <p>No articles found</p>;
}
console.log(articles);
    return (
      <div className="mt-8 mb-32 p-20 glass rounded-xl shadow-lg grid grid-cols-1 gap-9">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article: { _id: string, imageUrl: string, title: string, content: string, subscriptionLevel: string }) => (
            <div key={article._id} className="tooltip" data-tip={article.subscriptionLevel}>
              <li className="card glass shadow-md p-4 rounded-lg">
                <img src={article.imageUrl} alt={article.title} className="rounded-t-lg" />
                <div className="p-4">
                  <h2 className="text-xl font-bold">{article.title}</h2>
                  <p className="mt-2 text-md">{article.content}</p>
                </div>
              </li>
            </div>
          ))}
        </ul>
      </div>
    )
}

export default Articles;
