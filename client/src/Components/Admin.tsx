import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import ArticleFormData from '../Interfaces/Articleformdata';

export const Admin: React.FC = () => {
  const { register, handleSubmit, reset, setValue } = useForm<ArticleFormData>();
  const [articles, setArticles] = useState<ArticleFormData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const onSubmit: SubmitHandler<ArticleFormData> = async (data) => {
    try {
      if (editIndex !== null) {
        const updatedArticles = articles.map((article, index) =>
          index === editIndex ? data : article
        );
        setArticles(updatedArticles);
        setEditIndex(null);
        await fetch(`http://localhost:3000/api/articles/${articles[editIndex]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      } else {
        const response = await fetch('http://localhost:3000/api/articles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const newArticle = await response.json();
        setArticles([...articles, newArticle]);
      }
      reset();
    } catch (error) {
      console.error('Error submitting article:', error);
    }
  };
  
  const removeArticle = async (index: number) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const articleId = articles[index]._id;
      if (!articleId) {
        console.error('Article ID is undefined');
        return;
      }
      setArticles(articles.filter((_, i) => i !== index));
      if (editIndex === index) {
        reset();
        setEditIndex(null);
      }
      try {
        await fetch(`http://localhost:3000/api/articles/${articleId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };
  

  const editArticle = (index: number) => {
    const article = articles[index];
    /* setValue('_id', article._id) */
    setValue('title', article.title);
    setValue('content', article.content);
    setValue('subscriptionLevel', article.subscriptionLevel);
    setEditIndex(index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     {/*  <input type="hidden" {...register('_id')} /> */} 
        <div>
          <label className="block text-lg font-medium text-gray-700">Article Title</label>
          <input
            {...register('title', { required: true })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter article title"
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Content</label>
          <textarea
            {...register('content', { required: true })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Enter article content"
            rows={5}
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Subscription Level</label>
          <select
            {...register('subscriptionLevel', { required: true })}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          >
            <option value="DevBasics">DevBasics</option>
            <option value="DevPlus">DevPlus</option>
            <option value="DevDominator">DevDominator</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
        >
          {editIndex !== null ? 'Update Article' : 'Add Article'}
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-10">Articles</h2>
      <ul className="space-y-4 mt-4">
        {articles.map((article, index) => (
          <li key={index} className="p-4 border border-gray-300 rounded-md flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">{article.title}</h3>
              <p>{article.content}</p>
              <span className="text-sm text-gray-500">Subscription Level: {article.subscriptionLevel}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => editArticle(index)}
                className="py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              >
                Edit
              </button>
              <button
                onClick={() => removeArticle(index)}
                className="py-2 px-4 bg-red-500 text-white font-semibold rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
