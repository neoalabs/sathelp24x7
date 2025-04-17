import { useState } from 'react';
import { essayService } from '../services/api';

export default function EssayEditor() {
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await essayService.submitEssay(content);
      setFeedback(response.data.feedback);
    } catch (err) {
      console.error('Error submitting essay:', err);
      setError('Failed to get feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setContent('');
    setFeedback(null);
    setError(null);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Essay & CV Writing Lab</h2>
        <p className="text-sm opacity-80">Get AI-powered feedback on your college application essays</p>
      </div>
      
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="essay-content" className="block text-sm font-medium text-gray-700 mb-1">
              Your Essay
            </label>
            <textarea
              id="essay-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write or paste your essay here..."
              disabled={loading}
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading || (!content && !feedback)}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !content.trim()}
            >
              {loading ? 'Analyzing...' : 'Get Feedback'}
            </button>
          </div>
        </form>
        
        {feedback && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Essay Feedback</h3>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
              <div className="prose max-w-none">
                {feedback.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}