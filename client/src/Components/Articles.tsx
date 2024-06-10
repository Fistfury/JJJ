import { useEffect, useState } from 'react'

const Articles = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => { 
        const fetchArticles = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/articles');
          const data = await response.json();
          setArticles(data);
        } catch (error) {
          console.error('Error fetching articles:', error);
        }
      };

    fetchArticles();
}, [])

  return (
    <div>
        <ul>
            {articles.map((article) => (
                <li key={article._id}>
                    <img src={article.imageUrl} alt={article.title} />
                    <h2>{article.title}</h2>
                    <p>{article.content}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Articles