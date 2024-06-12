import { useEffect, useState } from 'react'

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => { 
        const fetchArticles = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/articles', {
            method: 'GET',
            credentials: 'include',
          });
          const data = await response.json();
          setArticles(data);
        } catch (error) {
          console.error('Error fetching articles:', error);
        }
      };

    fetchArticles();
}, [])

    return (
      <div className="mt-8 mb-32 p-20 glass rounded-xl shadow-lg grid grid-cols-1 gap-9">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article: { _id: string, imageUrl: string, title: string, content: string }) => (
            <li key={article._id} className="card glass shadow-md p-4 rounded-lg">
              <img src={article.imageUrl} alt={article.title} className="rounded-t-lg" />
              <div className="p-4">
                <h2 className="text-xl font-bold">{article.title}</h2>
                <p className="mt-2">{article.content}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
}

export default Articles